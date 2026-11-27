import { getPeopleMessages, getRoomMessages } from '../api/chat'
import type { ChatMessage, Member, RoomData } from '../types'

function getMsgTime(m: ChatMessage): number {
    if (!m.createAt) return 0
    const ts = Date.parse(m.createAt.replace(' ', 'T'))
    return Number.isNaN(ts) ? 0 : ts
}

export interface FetchHistoryResult {
    messages: ChatMessage[]
    members?: Member[]
}

export async function fetchAllMessages(
    convType: 'room' | 'direct',
    targetName: string,
    maxPages = 100
): Promise<FetchHistoryResult> {
    const all: ChatMessage[] = []
    const seen = new Set<string>()
    let members: Member[] | undefined

    for (let page = 1; page <= maxPages; page++) {
        let batch: ChatMessage[] = []

        if (convType === 'room') {
            const roomData = await getRoomMessages(targetName, page) as RoomData & {
                chatData?: ChatMessage[]
            }
            const rawBatch = Array.isArray(roomData?.chatData)
                ? roomData.chatData
                : Array.isArray(roomData?.chatMess)
                    ? roomData.chatMess
                    : []
            batch = rawBatch
            const rawUsers = roomData?.userList ?? roomData?.user
            if (page === 1 && Array.isArray(rawUsers)) {
                members = rawUsers.map((u, idx) => ({
                    id: String(u.id ?? idx),
                    name: String(u.name ?? 'Thành viên'),
                    online: true,
                }))
            }
        } else {
            const peopleMsgs: ChatMessage[] = await getPeopleMessages(targetName, page)
            batch = Array.isArray(peopleMsgs) ? peopleMsgs : []
        }

        if (batch.length === 0) break

        let added = 0
        for (const msg of batch) {
            const key =
                msg.id !== undefined
                    ? String(msg.id)
                    : `${msg.name}|${msg.to}|${msg.mes}|${msg.createAt ?? ''}`

            if (!seen.has(key)) {
                seen.add(key)
                all.push(msg)
                added++
            }
        }

        if (added === 0) break
    }

    all.sort((a, b) => getMsgTime(a) - getMsgTime(b))
    return { messages: all, members }
}