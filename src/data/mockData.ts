import type { Conversation } from '../types'

export const conversations: Conversation[] = [
    { id: '1', name: 'LTFE', lastMessage: 'A đang soạn tin...', time: '10:43', type: 'channel', pinned: true, online: true },
    { id: '2', name: 'Nguyen Van A', lastMessage: 'Ứng dụng ổn định', time: '09:12', type: 'direct', pinned: true, online: true },
    { id: '3', name: 'Frontend Team Project', lastMessage: 'David Kim: socket.onmessage = ...', time: '10:42', type: 'channel', unread: 3, online: true },
    { id: '4', name: 'Elena Rostova', lastMessage: 'Đã gửi bản review wireframe v2.4', time: '10:15', type: 'direct' },
    { id: '5', name: '#announcements', lastMessage: 'Lịch demo đồ án cuối kỳ tuần sau', time: 'Hôm qua', type: 'channel' },
    { id: '6', name: 'Design System Guild', lastMessage: 'Figma link updated for dark tokens', time: 'T.Hai', type: 'channel' },
    { id: '7', name: 'David Kim', lastMessage: 'API WebSocket đã deploy staging xong', time: 'CN', type: 'direct', online: true },
]