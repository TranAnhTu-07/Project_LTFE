import { useEffect, useState } from 'react'
import { Plus, Search, Hash, Pin } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'

import type { Conversation } from '../types'
import type { AppDispatch, RootState } from '../store'
import { fetchConversations } from '../store/conversationsSlice'
import { conversationId, formatTime, nowActionTime } from '../utils/conversation'
import CreateRoomModal from './CreateRoomModal'

const tabs = ['Tất cả', 'Chưa đọc', 'Nhóm', 'Trực tiếp']

function Avatar({ c }: { c: Conversation }) {
    return (
        <div className="conv-avatar-wrap">
            <div className="conv-avatar">
                {c.type === 'room' ? <Hash size={20} /> : <span>{c.name[0]}</span>}
            </div>
            {c.online && <span className="conv-online" />}
        </div>
    )
}

function Item({
    c,
    active,
    onSelect,
}: {
    c: Conversation
    active: boolean
    onSelect: () => void
}) {
    const displayTime = c.time || (c.actionTime ? formatTime(c.actionTime) : '')
    const displayLast =
        c.lastMessage ?? (c.type === 'room' ? 'Phòng trò chuyện' : 'Bắt đầu trò chuyện')

    return (
        <button
            className={`conv-item ${active ? 'active' : ''}`}
            onClick={onSelect}
        >
            <Avatar c={c} />
            <div className="conv-body">
                <div className="conv-row">
                    <span className="conv-name">{c.name}</span>
                    <span className="conv-time">{displayTime}</span>
                </div>
                <div className="conv-row">
                    <span className="conv-last">{displayLast}</span>
                    {c.unread ? <span className="conv-badge">{c.unread}</span> : null}
                </div>
            </div>
        </button>
    )
}

type Props = {
    activeId: string | null
    onSelect: (id: string) => void
    onCreate: (room: Conversation) => void
}

export function ConversationList({ activeId, onSelect, onCreate }: Props) {
    const dispatch = useDispatch<AppDispatch>()
    const { list: conversations, loading, error } = useSelector(
        (state: RootState) => state.conversations
    )

    const [tab, setTab] = useState('Tất cả')
    const [keyword, setKeyword] = useState('')
    const [showCreate, setShowCreate] = useState(false)

    useEffect(() => {
        dispatch(fetchConversations())
    }, [dispatch])

    const filtered = conversations.filter((c) => {
        if (keyword && !c.name.toLowerCase().includes(keyword.toLowerCase())) return false
        if (tab === 'Chưa đọc') return !!c.unread
        if (tab === 'Nhóm') return c.type === 'room'
        if (tab === 'Trực tiếp') return c.type === 'direct'
        return true
    })

    const pinned = filtered.filter((c) => c.pinned)
    const others = filtered.filter((c) => !c.pinned)

    function handleCreate(name: string) {
        const exists = conversations.some(
            (c) => c.type === 'room' && c.name.toLowerCase() === name.toLowerCase()
        )
        if (exists) throw new Error('Phòng đã tồn tại')

        const actionTime = nowActionTime()
        const room: Conversation = {
            id: conversationId(1, name),
            name,
            actionTime,
            time: formatTime(actionTime),
            lastMessage: 'Phòng vừa được tạo',
            type: 'room',
            members: [{ id: 'me', name: 'Bạn', online: true, role: 'admin' }],
        }

        onCreate(room)
        setTab('Tất cả')
        setKeyword('')
        setShowCreate(false)
    }

    return (
        <section className="chat-conversations">
            <div className="conv-header">
                <h2>
                    Tin nhắn <span className="conv-count">{conversations.length}</span>
                </h2>
                <button className="conv-add" onClick={() => setShowCreate(true)}>
                    <Plus size={20} />
                </button>
            </div>

            <div className="conv-tabs">
                {tabs.map((t) => (
                    <button
                        key={t}
                        className={`conv-tab ${tab === t ? 'active' : ''}`}
                        onClick={() => setTab(t)}
                    >
                        {t}
                    </button>
                ))}
            </div>

            <div className="conv-search">
                <Search size={16} />
                <input
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Tìm kiếm"
                />
            </div>

            <div className="conv-list">
                {loading && conversations.length === 0 && (
                    <p className="conv-empty">Đang tải hội thoại...</p>
                )}

                {!loading && error && conversations.length === 0 && (
                    <p className="conv-empty">{error}</p>
                )}

                {pinned.length > 0 && (
                    <>
                        <div className="conv-section">
                            <span>ĐÃ GHIM ({pinned.length})</span>
                            <Pin size={14} />
                        </div>
                        {pinned.map((c) => (
                            <Item
                                key={c.id}
                                c={c}
                                active={c.id === activeId}
                                onSelect={() => onSelect(c.id)}
                            />
                        ))}
                    </>
                )}

                <div className="conv-section">
                    <span>TẤT CẢ CUỘC HỘI THOẠI</span>
                </div>
                {others.map((c) => (
                    <Item
                        key={c.id}
                        c={c}
                        active={c.id === activeId}
                        onSelect={() => onSelect(c.id)}
                    />
                ))}

                {!loading && !error && filtered.length === 0 && (
                    <p className="conv-empty">Không tìm thấy hội thoại nào</p>
                )}
            </div>

            {showCreate && (
                <CreateRoomModal
                    onClose={() => setShowCreate(false)}
                    onSubmit={handleCreate}
                />
            )}
        </section>
    )
}