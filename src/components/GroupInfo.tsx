import { useState } from 'react'
import { Search, Bell, BellOff, UserPlus, LogOut, Hash } from 'lucide-react'
import type { Conversation } from '../types'

type Props = { conversation: Conversation; onLeave: () => void }

export default function GroupInfo({ conversation: c, onLeave }: Props) {
    const [muted, setMuted] = useState(false)
    const members = c.members ?? []
    const onlineCount = members.filter((m) => m.online).length

    return (
        <aside className="chat-info">
            <div className="info-header">
                <div className="info-avatar"><Hash size={32} /></div>
                <h3>{c.name}</h3>
                <p className="status-text">{members.length} thành viên · {onlineCount} đang online</p>
            </div>

            <div className="info-actions">
                <button className="info-action-btn">
                    <Search size={20} />
                    <span>Tìm kiếm</span>
                </button>
                <button className={`info-action-btn ${muted ? 'active' : ''}`} onClick={() => setMuted(!muted)}>
                    {muted ? <BellOff size={20} /> : <Bell size={20} />}
                    <span>{muted ? 'Đã tắt TB' : 'Tắt thông báo'}</span>
                </button>
                <button className="info-action-btn">
                    <UserPlus size={20} />
                    <span>Thêm người</span>
                </button>
            </div>

            <div className="info-members">
                <div className="info-section-title"><span>Thành viên ({members.length})</span></div>
                {members.map((m) => (
                    <div className="member-item" key={m.id}>
                        <div className="member-avatar">
                            {m.name[0]}
                            <span className={`member-dot ${m.online ? 'online' : ''}`} />
                        </div>
                        <div className="member-info">
                            <h4>{m.name}</h4>
                            <p>{m.online ? 'Đang hoạt động' : 'Ngoại tuyến'}</p>
                        </div>
                        {m.role === 'admin' && <span className="member-role admin">ADMIN</span>}
                    </div>
                ))}
            </div>

            <div className="info-footer">
                <button className="info-danger" onClick={onLeave}>
                    <LogOut size={16} /> Rời phòng
                </button>
            </div>
        </aside>
    )
}