const WS_URL = 'wss://chat.longapp.io.vn/chat/chat';

export type ServerMsg = {
    status: 'success' | 'error';
    event: string;
    data?: any;
    mes?: string;
};

type Listener = (msg: ServerMsg) => void;
let ws: WebSocket | null = null;
let opening: Promise<void> | null = null;
const listeners = new Map<string, Set<Listener>>();

let connectionId: string | null = null;
export const getConnectionId = () => connectionId;

function emit(msg: ServerMsg) {
    listeners.get(msg.event)?.forEach((fn) => fn(msg));
}

export function on(event: string, fn: Listener) {
    if (!listeners.has(event)) listeners.set(event, new Set());
    listeners.get(event)!.add(fn);
    return () => listeners.get(event)?.delete(fn);
}
export function connect(): Promise<void> {
    if (ws && ws.readyState === WebSocket.OPEN) return Promise.resolve();
    if (opening) return opening;

    opening = new Promise((resolve, reject) => {
        const s = new WebSocket(WS_URL);
        ws = s;
        s.onopen = () => {
            opening = null;
            resolve();
        };
        s.onerror = () => {
            opening = null;
            reject(new Error('Không kết nối được server'));
        };
        s.onclose = () => {
            ws = null;
            opening = null;
        };
        s.onmessage = (e) => {
            console.log('SERVER:', e.data)
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

export function request(event: string, data?: unknown, timeout = 15000): Promise<ServerMsg> {
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