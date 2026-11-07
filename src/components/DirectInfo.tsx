import { useState } from 'react'
import { Search, Bell, BellOff, Ban, Briefcase, Mail, MapPin, Trash2 } from 'lucide-react'
import type { Conversation } from '../types'

type Props = { conversation: Conversation; onDelete: () => void }

export default function DirectInfo({ conversation: c, onDelete }: Props) {
    const [muted, setMuted] = useState(false)
    const [blocked, setBlocked] = useState(false)
    const details = [
        { icon: <Briefcase size={16} />, label: 'Chức vụ', value: c.position },
        { icon: <Mail size={16} />, label: 'Email', value: c.email },
        { icon: <MapPin size={16} />, label: 'Vị trí', value: c.location },
    ].filter((d) => d.value)

    return (
        <aside className="chat-info">
            <div className="info-header">
                <div className="info-avatar">
                    <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=6366f1&color=fff&size=72`}
                        alt={c.name}
                    />
                    <div className={`status-badge ${c.online ? 'online' : ''}`} />
                </div>
                <h3>{c.name}</h3>
                <p className="status-text">{c.online ? 'Đang hoạt động' : 'Ngoại tuyến'}</p>
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
                <button className={`info-action-btn danger ${blocked ? 'active' : ''}`} onClick={() => setBlocked(!blocked)}>
                    <Ban size={20} />
                    <span>{blocked ? 'Bỏ chặn' : 'Chặn'}</span>
                </button>
            </div>

            {blocked && <p className="info-notice">Bạn đã chặn người này. Họ không thể nhắn tin cho bạn.</p>}

            {details.length > 0 && (
                <div className="info-details">
                    <div className="info-section-title"><span>Thông tin cá nhân</span></div>
                    {details.map((d) => (
                        <div className="detail-item" key={d.label}>
                            {d.icon}
                            <div className="detail-content">
                                <span className="detail-label">{d.label}</span>
                                <span className="detail-value">{d.value}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <div className="info-footer">
                <button className="info-danger" onClick={onDelete}>
                    <Trash2 size={16} /> Xóa cuộc trò chuyện
                </button>
            </div>
        </aside>
    )
}