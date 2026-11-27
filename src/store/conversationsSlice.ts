import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import type { Conversation, ChatMessage, UserListItem, Member } from '../types.ts'
import { getUserList } from '../api/chat.ts'
import { fetchAllMessages } from '../services/messageHistory.ts'
import { conversationId, formatTime, nowActionTime, toConversation } from '../utils/conversation.ts'
import type { RootState } from './index.ts'

type State = {
    list: Conversation[]
    activeId: string | null
    loading: boolean
    error: string
    messagesByConv: Record<string, ChatMessage[]>
    loadingMessages: boolean
    messagesError: string
}

const initialState: State = {
    list: [],
    activeId: null,
    loading: false,
    error: '',
    messagesByConv: {},
    loadingMessages: false,
    messagesError: '',
}

const currentUser = () => localStorage.getItem('user') || ''

function formatFromMessage(msg: ChatMessage): string {
    if (!msg.createAt) return formatTime(nowActionTime())
    const formatted = formatTime(msg.createAt)
    return formatted || msg.createAt.slice(0, 5)
}

export const fetchConversations = createAsyncThunk<Conversation[], void, { rejectValue: string }>(
    'conversations/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const items: UserListItem[] = await getUserList()
            const me = currentUser()

            return items
                .filter((item) => !(item.type === 0 && item.name === me))
                .map((item) => {
                    const conv = toConversation(item)
                    return {
                        ...conv,
                        time: item.actionTime ? formatTime(item.actionTime) : '',
                        lastMessage: conv.type === 'room' ? 'Phòng trò chuyện' : 'Bắt đầu trò chuyện',
                        unread: 0,
                    }
                })
        } catch (err) {
            return rejectWithValue(
                err instanceof Error ? err.message : 'Không tải được danh sách hội thoại'
            )
        }
    }
)

export const fetchConversationMessages = createAsyncThunk<
    { convId: string; messages: ChatMessage[]; members?: Member[] },
    { convId: string; type: 'room' | 'direct'; name: string },
    { rejectValue: string }
>(
    'conversations/fetchMessages',
    async ({ convId, type, name }, { rejectWithValue }) => {
        try {
            const { messages, members } = await fetchAllMessages(type, name)
            return { convId, messages, members }
        } catch (err) {
            return rejectWithValue(
                err instanceof Error ? err.message : 'Không tải được lịch sử tin nhắn'
            )
        }
    }
)

const slice = createSlice({
    name: 'conversations',
    initialState,
    reducers: {
        setActive(state, action: PayloadAction<string | null>) {
            state.activeId = action.payload
            const target = state.list.find((c) => c.id === action.payload)
            if (target) target.unread = 0
        },
        addConversation(state, action: PayloadAction<Conversation>) {
            const now = nowActionTime()
            const conv: Conversation = {
                ...action.payload,
                actionTime: action.payload.actionTime || now,
                time: action.payload.time || formatTime(now),
                lastMessage: action.payload.lastMessage || 'Bắt đầu trò chuyện',
                unread: action.payload.unread ?? 0,
            }
            if (!state.list.some((c) => c.id === conv.id)) {
                state.list.unshift(conv)
            }
            state.activeId = conv.id
        },
        removeConversation(state, action: PayloadAction<string>) {
            state.list = state.list.filter((c) => c.id !== action.payload)
            delete state.messagesByConv[action.payload]
            if (state.activeId === action.payload) state.activeId = null
        },
        appendMessage(state, action: PayloadAction<ChatMessage>) {
            const msg = action.payload
            const me = currentUser()
            const isRoom = msg.type === 1
            const peerName = isRoom ? msg.to : msg.name === me ? msg.to : msg.name
            const id = conversationId(msg.type, peerName)

            const currentList = [...(state.messagesByConv[id] ?? [])]
            const isExactDuplicate =
                msg.id !== undefined &&
                currentList.some((m) => m.id !== undefined && String(m.id) === String(msg.id))

            if (!isExactDuplicate) {
                const localIdx =
                    typeof msg.id === 'number' && msg.id > 0
                        ? currentList.findIndex(
                              (m) =>
                                  typeof m.id === 'number' &&
                                  m.id < 0 &&
                                  m.name === msg.name &&
                                  m.to === msg.to &&
                                  m.mes === msg.mes
                          )
                        : -1

                if (localIdx !== -1) {
                    currentList[localIdx] = msg
                } else {
                    currentList.push(msg)
                }
                state.messagesByConv[id] = currentList
            }

            const actionTime = msg.createAt || nowActionTime()
            const time = formatFromMessage(msg)
            const conv = state.list.find((c) => c.id === id)

            if (conv) {
                conv.lastMessage = msg.mes
                conv.actionTime = actionTime
                conv.time = time
                if (state.activeId !== id && msg.name !== me) {
                    conv.unread = (conv.unread ?? 0) + 1
                }
                state.list = [conv, ...state.list.filter((c) => c.id !== id)]
            } else {
                state.list.unshift({
                    id,
                    name: peerName,
                    type: isRoom ? 'room' : 'direct',
                    actionTime,
                    time,
                    lastMessage: msg.mes,
                    unread: state.activeId !== id && msg.name !== me ? 1 : 0,
                    members: isRoom ? [{ id: 'me', name: 'Bạn', online: true, role: 'admin' }] : undefined,
                })
            }
        },
        setConversationMembers(
            state,
            action: PayloadAction<{ convId: string; members: Member[] }>
        ) {
            const conv = state.list.find((c) => c.id === action.payload.convId)
            if (conv) {
                conv.members = action.payload.members
            }
        },
        setConversationMessages(
            state,
            action: PayloadAction<{ convId: string; messages: ChatMessage[] }>
        ) {
            state.messagesByConv[action.payload.convId] = action.payload.messages
            const conv = state.list.find((c) => c.id === action.payload.convId)
            const latest = action.payload.messages[action.payload.messages.length - 1]
            if (conv && latest) {
                conv.lastMessage = latest.mes
                if (latest.createAt) {
                    conv.actionTime = latest.createAt
                    conv.time = formatFromMessage(latest)
                }
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchConversations.pending, (state) => {
                state.loading = true
                state.error = ''
            })
            .addCase(fetchConversations.fulfilled, (state, action) => {
                state.loading = false
                const fetchedIds = new Set(action.payload.map((c) => c.id))
                const extra = state.list.filter((c) => !fetchedIds.has(c.id))
                state.list = [...extra, ...action.payload]
            })
            .addCase(fetchConversations.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload ?? 'Lỗi tải hội thoại'
            })
            .addCase(fetchConversationMessages.pending, (state) => {
                state.loadingMessages = true
                state.messagesError = ''
            })
            .addCase(fetchConversationMessages.fulfilled, (state, action) => {
                state.loadingMessages = false
                const { convId, messages, members } = action.payload
                state.messagesByConv[convId] = messages

                const conv = state.list.find((c) => c.id === convId)
                if (conv) {
                    if (members) {
                        conv.members = members
                    }
                    const latest = messages[messages.length - 1]
                    if (latest) {
                        conv.lastMessage = latest.mes
                        if (latest.createAt) {
                            conv.actionTime = latest.createAt
                            conv.time = formatFromMessage(latest)
                        }
                    }
                }
            })
            .addCase(fetchConversationMessages.rejected, (state, action) => {
                state.loadingMessages = false
                state.messagesError = action.payload ?? 'Lỗi tải tin nhắn'
            })
    },
})

export const { setActive, addConversation, removeConversation, appendMessage, setConversationMembers, setConversationMessages } = slice.actions
export default slice.reducer
export const selectActive = (s: RootState) =>
    s.conversations.list.find((c) => c.id === s.conversations.activeId) ?? null