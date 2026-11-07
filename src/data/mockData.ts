import type { Conversation } from '../types'

export const conversations: Conversation[] = [
    {
        id: '1', name: 'LTFE', lastMessage: 'A đang soạn tin...', time: '10:43',
        type: 'channel', pinned: true, online: true,
        members: [
            { id: 'm1', name: 'Nguyen Van A', online: true, role: 'admin' },
            { id: 'm2', name: 'Elena Rostova', online: false, role: 'member' },
            { id: 'm3', name: 'David Kim', online: true, role: 'member' },
        ],
    },
    {
        id: '2', name: 'Nguyen Van A', lastMessage: 'Ứng dụng ổn định', time: '09:12',
        type: 'direct', pinned: true, online: true,
        email: 'nguyenvana@pulsechat.com',
        position: 'Frontend Developer',
        location: 'Hồ Chí Minh, Việt Nam',
    },
    {
        id: '3', name: 'Frontend Team Project', lastMessage: 'David Kim: socket.onmessage = ...', time: '10:42',
        type: 'channel', unread: 3, online: true,
        members: [
            { id: 'm3', name: 'David Kim', online: true, role: 'admin' },
            { id: 'm1', name: 'Nguyen Van A', online: true, role: 'member' },
            { id: 'm4', name: 'Thùy Vy', online: true, role: 'member' },
            { id: 'm5', name: 'Tran Anh Tu', online: false, role: 'member' },
        ],
    },
    {
        id: '4', name: 'Elena Rostova', lastMessage: 'Đã gửi bản review wireframe v2.4', time: '10:15',
        type: 'direct',
        email: 'elena.rostova@pulsechat.com',
        position: 'Product Designer',
        location: 'Hà Nội, Việt Nam',
    },
    {
        id: '5', name: '#announcements', lastMessage: 'Lịch demo đồ án cuối kỳ tuần sau', time: 'Hôm qua',
        type: 'channel',
        members: [
            { id: 'm6', name: 'Giảng viên', online: false, role: 'admin' },
            { id: 'm1', name: 'Nguyen Van A', online: true, role: 'member' },
            { id: 'm4', name: 'Thùy Vy', online: true, role: 'member' },
        ],
    },
    {
        id: '6', name: 'Design System Guild', lastMessage: 'Figma link updated for dark tokens', time: 'T.Hai',
        type: 'channel',
        members: [
            { id: 'm2', name: 'Elena Rostova', online: false, role: 'admin' },
            { id: 'm4', name: 'Thùy Vy', online: true, role: 'member' },
        ],
    },
    {
        id: '7', name: 'David Kim', lastMessage: 'API WebSocket đã deploy staging xong', time: 'CN',
        type: 'direct', online: true,
        email: 'david.kim@pulsechat.com',
        position: 'Backend Developer',
        location: 'Đà Nẵng, Việt Nam',
    },
]