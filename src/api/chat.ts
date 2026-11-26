import { request, send, on } from './socket';
import { ensureLogin } from './auth'; // Đảm bảo gọi được auth và vòng lặp tự RE_LOGIN
import type { UserListItem, RoomData, ChatMessage, CheckStatusResponse } from '../types';

export const getUserList = async (): Promise<UserListItem[]> => {
    const res = await request('GET_USER_LIST');
    return res.data;
};
export const createRoom = async (name: string): Promise<RoomData> => {
    const res = await request('CREATE_ROOM', { name });
    return res.data;
};
export const joinRoom = async (name: string): Promise<RoomData> => {
    const res = await request('JOIN_ROOM', { name });
    return res.data;
};
export const outRoom = async (name: string): Promise<{ mes: string }> => {
    const res = await request('OUT_ROOM', { name });
    return res.data;
};
export const getRoomMessages = async (name: string, page: number = 1): Promise<RoomData> => {
    try {
        const res = await request('GET_ROOM_CHAT_MES', { name, page });
        return res.data;
    } catch (err) {
        if (err instanceof Error && err.message.includes('You not in room')) {
            await joinRoom(name);
            const res = await request('GET_ROOM_CHAT_MES', { name, page });
            return res.data;
        }
        throw err;
    }
};
export const getPeopleMessages = async (name: string, page: number = 1): Promise<ChatMessage[]> => {
    const res = await request('GET_PEOPLE_CHAT_MES', { name, page });
    return res.data;
};
// xử lý nhắn tin, tách biệt gửi và nhận
//Gửi tin thẳng qua socket, k chờ phản hồi để tránh kẹt hàng đợi
export const sendChat = async (type: 'room' | 'people', to: string, mes: string): Promise<void> => {
    await ensureLogin(); // Cực kỳ quan trọng: đảm bảo đang login trước khi send()
    await send('SEND_CHAT', { type, to, mes });
};
//tin nhắn mới đẩy về từ server
export const onChatMessage = (fn: (m: ChatMessage) => void) =>
    on('SEND_CHAT', (msg) => {
        if (msg.status === 'success') fn(msg.data as ChatMessage);
    });
//báo lỗi khi gửi tin
export const onChatError = (fn: (mes: string) => void) =>
    on('SEND_CHAT', (msg) => {
        if (msg.status === 'error') fn(msg.mes ?? 'Gửi tin thất bại');
    });

//các hàm check status
export const checkOnline = async (user: string): Promise<CheckStatusResponse> => {
    const res = await request('CHECK_USER_ONLINE', { user });
    return res.data;
};
export const checkExist = async (user: string): Promise<CheckStatusResponse> => {
    const res = await request('CHECK_USER_EXIST', { user });
    return res.data;
};