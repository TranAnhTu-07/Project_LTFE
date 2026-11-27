import { useState } from 'react'
import { Search, ArrowUpDown, Filter, ChevronDown, MoreHorizontal, Hash } from 'lucide-react'
import { useAppSelector } from '../store/hooks.ts'
import type { Conversation } from '../types.ts'
import '../styles/Contacts.css'

type RowProps = {
    contact: Conversation
    onOpen: () => void
}
function Row({ contact, onOpen }: RowProps) {
    return (
        <div className="ct-row" onClick={onOpen} style={{ cursor: 'pointer' }}>
            <div className="ct-avatar-wrap">
                <div className="ct-avatar c1">
                    {contact.type === 'direct' ? contact.name[0].toUpperCase() : <Hash size={20} />}
                </div>
                {contact.online && <span className="ct-online" />}
            </div>

            <span className="ct-name">{contact.name}</span>

            <button className="ct-more" title="Tùy chọn" onClick={(e) => e.stopPropagation()}>
                <MoreHorizontal size={30} />
            </button>
        </div>
    )
}

type Props = {
    onOpen: (id: string) => void
}

export default function Contacts({ onOpen }: Props) {
    const list = useAppSelector((state) => state.conversations.list)

    const [keyword, setKeyword] = useState('')
    const [sort, setSort] = useState('az')
    const [filter, setFilter] = useState('all')

    let items = list.filter((c) =>
        c.name.toLowerCase().includes(keyword.trim().toLowerCase())
    )

    if (filter === 'people') {
        items = items.filter((c) => c.type === 'direct')
    } else if (filter === 'groups') {
        items = items.filter((c) => c.type !== 'direct')
    } else if (filter === 'online') {
        items = items.filter((c) => c.online)
    }

    items = [...items].sort((a, b) => a.name.localeCompare(b.name, 'vi'))
    if (sort === 'za') {
        items.reverse()
    }

    const groups: Record<string, Conversation[]> = {}
    for (const contact of items) {
        const letter = contact.name[0].toUpperCase()
        if (!groups[letter]) {
            groups[letter] = []
        }
        groups[letter].push(contact)
    }

    const letters = Object.keys(groups)

    return (
        <main className="ct-page">
            <header className="ct-header">
                <h2>Danh bạ ({items.length})</h2>
            </header>

            <div className="ct-body">
                <div className="ct-toolbar">
                    <div className="ct-search">
                        <Search size={16} />
                        <input
                            placeholder="Tìm bạn"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                    </div>

                    <div className="ct-select">
                        <ArrowUpDown size={16} className="ct-select-icon" />
                        <select value={sort} onChange={(e) => setSort(e.target.value)}>
                            <option value="az">Tên (A-Z)</option>
                            <option value="za">Tên (Z-A)</option>
                        </select>
                        <ChevronDown size={16} className="ct-select-arrow" />
                    </div>

                    <div className="ct-select">
                        <Filter size={16} className="ct-select-icon" />
                        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                            <option value="all">Tất cả</option>
                            <option value="people">Cá nhân</option>
                            <option value="groups">Nhóm</option>
                            <option value="online">Đang online</option>
                        </select>
                        <ChevronDown size={16} className="ct-select-arrow" />
                    </div>
                </div>

                <div className="ct-list">
                    {letters.map((letter) => (
                        <div key={letter}>
                            <div className="ct-letter">{letter}</div>
                            {groups[letter].map((contact) => (
                                <Row
                                    key={contact.id}
                                    contact={contact}
                                    onOpen={() => onOpen(contact.id)}
                                />
                            ))}
                        </div>
                    ))}

                    {items.length === 0 && (
                        <p className="ct-empty">
                            {list.length === 0
                                ? 'Chưa có cuộc trò chuyện nào.'
                                : 'Không tìm thấy kết quả'}
                        </p>
                    )}
                </div>
            </div>
        </main>
    )
}