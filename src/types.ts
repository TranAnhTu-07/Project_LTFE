export interface UserListItem {
    name: string;
    type: 0 | 1;
    actionTime: string;
}

export interface RoomMember {
    id: number;
    name: string;
}

export interface ChatMessage {
    id?: number;
    name: string;
    to: string;
    mes: string;
    createAt?: string;
    type: 0 | 1;
}

export interface RoomData {
    name: string;
    user: RoomMember[];
    chatMess: ChatMessage[];
}

export interface CheckStatusResponse {
    status: boolean;
}