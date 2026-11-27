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
    id?: number;
    name: string;
    own?: string;
    createTime?: string;
    userList?: RoomMember[];
    user?: RoomMember[]; //tên dự phòng theo API
    chatData?: ChatMessage[];
    chatMess?: ChatMessage[];   // tên dự phongf theo API
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
    type: 'room' | 'direct';
    actionTime: string;
    online?: boolean;
    pinned?: boolean;
    members?: Member[];
    position?: string;
    email?: string;
    location?: string;
    lastMessage?: string;
    time?: string;
    unread?: number;
}