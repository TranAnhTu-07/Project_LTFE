import { useState } from 'react'
import { Plus, Search, Hash, Pin } from 'lucide-react'
import { conversations } from '../data/mockData'
import type { Conversation } from '../types'

const tabs = ['Tất cả', 'Chưa đọc', 'Nhóm', 'Trực tiếp']

function Avatar({ c }: { c: Conversation }) {
    return (
        <div className="conv-avatar-wrap">
            <div className="conv-avatar">
                {c.type === 'channel' ? <Hash size={20} /> : <span>{c.name[0]}</span>}
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
    return (
        <button
            className={`conv-item ${active ? 'active' : ''}`}
            onClick={onSelect}
        >
            <Avatar c={c} />
            <div className="conv-body">
                <div className="conv-row">
                    <span className="conv-name">{c.name}</span>
                    <span className="conv-time">{c.time}</span>
                </div>
                <div className="conv-row">
                    <span className="conv-last">{c.lastMessage}</span>
                    {c.unread ? <span className="conv-badge">{c.unread}</span> : null}
                </div>
            </div>
        </button>
    )
}

export default function ConversationList() {
    const [tab, setTab] = useState('Tất cả')
    const [keyword, setKeyword] = useState('')
    const [activeId, setActiveId] = useState('3')

    const filtered = conversations.filter((c) => {
        if (keyword && !c.name.toLowerCase().includes(keyword.toLowerCase())) return false
        if (tab === 'Chưa đọc') return !!c.unread
        if (tab === 'Nhóm') return c.type === 'channel'
        if (tab === 'Trực tiếp') return c.type === 'direct'
        return true
    })

    const pinned = filtered.filter((c) => c.pinned)
    const others = filtered.filter((c) => !c.pinned)

    return (
        <section className="chat-conversations">
            <div className="conv-header">
                <h2>
                    Tin nhắn <span className="conv-count">{conversations.length}</span>
                </h2>
                <button className="conv-add">
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
                {pinned.length > 0 && (
                    <>
                        <div className="conv-section">
                            <span>ĐÃ GHIM ({pinned.length})</span>
                            <Pin size={14} />
                        </div>
                        {pinned.map((c) => (
                            <Item key={c.id} c={c} active={c.id === activeId} onSelect={() => setActiveId(c.id)} />
                        ))}
                    </>
                )}

                <div className="conv-section">
                    <span>TẤT CẢ CUỘC HỘI THOẠI</span>
                </div>
                {others.map((c) => (
                    <Item key={c.id} c={c} active={c.id === activeId} onSelect={() => setActiveId(c.id)} />
                ))}

                {filtered.length === 0 && <p className="conv-empty">Không tìm thấy hội thoại nào</p>}
            </div>
        </section>
    )
}