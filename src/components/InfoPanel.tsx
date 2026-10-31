import { Phone, Video, Search, Mail, Briefcase, MapPin } from 'lucide-react';

export default function InfoPanel() {
    return (
        <aside className="chat-info">
            <div className="info-header">
                <div className="info-avatar direct-avatar">
                    <img
                        src="https://ui-avatars.com/api/?name=Alex+Rivera&background=6366f1&color=fff&size=72"
                        alt="Alex"
                    />
                    <div className="status-badge online"></div>
                </div>
                <h3>Alex Rivera</h3>
                <p className="status-text">Đang hoạt động</p>
            </div>

            <div className="info-actions">
                <button className="info-action-btn">
                    <Phone size={20} />
                    <span>Gọi thoại</span>
                </button>
                <button className="info-action-btn">
                    <Video size={20} />
                    <span>Video</span>
                </button>
                <button className="info-action-btn">
                    <Search size={20} />
                    <span>Tìm kiếm</span>
                </button>
            </div>

            <div className="info-details">
                <div className="info-section-title">
                    <span>Thông tin cá nhân</span>
                </div>

                <div className="detail-item">
                    <Briefcase size={16} />
                    <div className="detail-content">
                        <span className="detail-label">Chức vụ</span>
                        <span className="detail-value">Senior UI/UX Designer</span>
                    </div>
                </div>

                <div className="detail-item">
                    <Mail size={16} />
                    <div className="detail-content">
                        <span className="detail-label">Email</span>
                        <span className="detail-value">alex.rivera@pulsechat.com</span>
                    </div>
                </div>

                <div className="detail-item">
                    <MapPin size={16} />
                    <div className="detail-content">
                        <span className="detail-label">Vị trí</span>
                        <span className="detail-value">Hồ Chí Minh, Việt Nam</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}