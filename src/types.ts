export type Conversation = {
    id: string
    name: string
    lastMessage: string
    time: string
    type: 'channel' | 'direct'
    unread?: number
    pinned?: boolean
    online?: boolean

    members?: Member[]
    email?: string
    position?: string
    location?: string
}

export type Member = {
    id: string
    name: string
    online: boolean
    role?: 'admin' | 'member'
}
