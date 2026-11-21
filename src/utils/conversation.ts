import type { Conversation, UserListItem } from '../types.ts'

const pad = (n: number) => String(n).padStart(2, '0')

export const conversationId = (type: 0 | 1, name: string) => `${type}-${name}`

export function toConversation(item: UserListItem): Conversation {
    return {
        id: conversationId(item.type, item.name),
        name: item.name,
        type: item.type === 1 ? 'channel' : 'direct',
        actionTime: item.actionTime,
    }
}

export function nowActionTime() {
    const d = new Date()
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

export function formatTime(actionTime: string) {
    const [date, time] = (actionTime ?? '').split(' ')
    if (!date || !time) return ''

    const now = new Date()
    const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
    if (date === today) return time.slice(0, 5)

    const [, month, day] = date.split('-')
    return `${day}/${month}`
}