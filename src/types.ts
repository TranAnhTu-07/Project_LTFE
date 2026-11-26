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

export interface Member {
    id: string;
    name: string;
    online: boolean;
    role?: 'admin' | 'member';
}
export interface Conversation {
    id: string;
    name: string;
    type: 'channel' | 'direct';
    actionTime: string;
    online?: boolean;
    members?: Member[];
    position?: string;
    email?: string;
    location?: string;
}