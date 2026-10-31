export type Conversation = {
    id: string
    name: string
    lastMessage: string
    time: string
    type: 'channel' | 'direct'
    unread?: number
    pinned?: boolean
    online?: boolean
}