const WS_URL = 'wss://chat.longapp.io.vn/chat/chat';

export type ServerMsg = {
    status: 'success' | 'error';
    event: string;
    data?: any;
    mes?: string;
};

export type ConnectionState = 'connected' | 'reconnecting' | 'disconnected';

type Listener = (msg: ServerMsg) => void;
type StateListener = (state: ConnectionState) => void;

let ws: WebSocket | null = null;
let opening: Promise<void> | null = null;

let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
let shouldReconnect = false;
let connState: ConnectionState = 'disconnected';

const listeners = new Map<string, Set<Listener>>();
const stateListeners = new Set<StateListener>();
const disconnectHooks = new Set<() => void>();

const eventQueues = new Map<string, Promise<unknown>>;

let reLoginHandler: (() => Promise<boolean>) | null = null;

function setConnState(next: ConnectionState) {
    if(connState === next) return;
    connState = next;
    stateListeners.forEach((fn) => fn(next));
}
//viết sự kiện gắn cái nayf vào trong ChatPage.tsx hay ChatWindow.tsx để hiện thông báo "Đang kết nối lại..."
export const getConnectionState = () => connState;
export function onConnectionStateChange(fn: StateListener) {
    stateListeners.add(fn);
    return () => stateListeners.delete(fn);
}
export function onDisconnect(fn: () => void) {
    disconnectHooks.add(fn);
    return () => disconnectHooks.delete(fn);
}
export function setReLoginHandler(fn: (() => Promise<boolean>) | null) {
    reLoginHandler = fn;
}
export function setAutoReconnect(enabled: boolean) {
    shouldReconnect = enabled;
    if (!enabled && reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
    }
}
function emit(msg: ServerMsg) {
    listeners.get(msg.event)?.forEach((fn) => fn(msg));
}

export function on(event: string, fn: Listener) {
    if (!listeners.has(event)) listeners.set(event, new Set());
    listeners.get(event)!.add(fn);
    return () => listeners.get(event)?.delete(fn);
}
function scheduleReconnect() {
    if (!shouldReconnect || reconnectTimer) return;
    setConnState('reconnecting');
    reconnectTimer = setTimeout(async () => {
        reconnectTimer = null;
        try {
            await connect();
            if (reLoginHandler) await reLoginHandler();
        } catch {
            scheduleReconnect();
        }
    }, 2000);
}
export function connect(): Promise<void> {
    if (ws && ws.readyState === WebSocket.OPEN) return Promise.resolve();
    if (opening) return opening;

    opening = new Promise((resolve, reject) => {
        const s = new WebSocket(WS_URL);
        ws = s;
        s.onopen = () => {
            opening = null;
            setConnState('connected');
            resolve();
        };
        s.onerror = () => {
            opening = null;
            reject(new Error('Không kết nối được server'));
        };
        s.onclose = () => {
            ws = null;
            opening = null;
            disconnectHooks.forEach((fn) => fn());
            if (shouldReconnect && localStorage.getItem('user') && localStorage.getItem('reLoginCode')) {
                scheduleReconnect();
            } else {
                setConnState('disconnected');
            }
        };
        s.onmessage = (e) => {
            try { emit(JSON.parse(e.data)) } catch {}
        };
    });
    return opening;
}
export async function send(event: string, data?: unknown) {
    await connect();
    ws!.send(JSON.stringify({
        action: 'onchat',
        data: data === undefined ? { event } : { event, data },
    }));
}

function sendAndWait(event: string, data?: unknown, timeout = 15000): Promise<ServerMsg> {
    return new Promise((resolve, reject) => {
        const off = on(event, (msg) => {
            clearTimeout(timer);
            off();
            if (msg.status === 'success') resolve(msg);
            else reject(new Error(msg.mes ?? 'Có lỗi xảy ra'));
        });

        const timer = setTimeout(() => {
            off();
            reject(new Error('Server không phản hồi'));
        }, timeout);

        send(event, data).catch((err) => {
            clearTimeout(timer);
            off();
            reject(err);
        });
    });
}
const AUTH_EVENTS = new Set(['LOGIN', 'RE_LOGIN', 'REGISTER', 'LOGOUT']);

export function request(event: string, data?: unknown, timeout = 15000): Promise<ServerMsg> {
    if (AUTH_EVENTS.has(event)) {
        return sendAndWait(event, data, timeout);
    }
    const prev = eventQueues.get(event) ?? Promise.resolve();
    const task = prev
        .catch(() => {})
        .then(async () => {
            if (reLoginHandler) await reLoginHandler();
            return sendAndWait(event, data, timeout);
        });
    eventQueues.set(event, task);
    task.finally(() => {
        if (eventQueues.get(event) === task) {
            eventQueues.delete(event);
        }
    });
    return task;
}