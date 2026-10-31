import { Plus, Search, Hash, Pin } from 'lucide-react'

export default function ConversationList() {
    return (
        <section className="chat-conversations">
            <div className="conv-header">
                <h2>
                    Tin nhắn <span className="conv-count">24</span>
                </h2>
                <button className="conv-add">
                    <Plus size={20} />
                </button>
            </div>

            <div className="conv-tabs">
                <button className="conv-tab active">Tất cả</button>
                <button className="conv-tab">Chưa đọc</button>
                <button className="conv-tab">Nhóm</button>
                <button className="conv-tab">Trực tiếp</button>
            </div>

            <div className="conv-search">
                <Search size={16} />
                <input placeholder="Tìm kiếm nhanh..." />
            </div>

            <div className="conv-list">
                <div className="conv-section">
                    <span>ĐÃ GHIM (2)</span>
                    <Pin size={14} />
                </div>

                <button className="conv-item">
                    <div className="conv-avatar-wrap">
                        <div className="conv-avatar"><Hash size={20} /></div>
                        <span className="conv-online" />
                    </div>
                    <div className="conv-body">
                        <div className="conv-row">
                            <span className="conv-name">dev-frontend</span>
                            <span className="conv-time">10:43</span>
                        </div>
                        <div className="conv-row">
                            <span className="conv-last">A đang soạn tin...</span>
                        </div>
                    </div>
                </button>

                <button className="conv-item">
                    <div className="conv-avatar-wrap">
                        <div className="conv-avatar"><span>A</span></div>
                        <span className="conv-online" />
                    </div>
                    <div className="conv-body">
                        <div className="conv-row">
                            <span className="conv-name">Nguyễn Văn A</span>
                            <span className="conv-time">09:12</span>
                        </div>
                        <div className="conv-row">
                            <span className="conv-last">Ứng dụng ổn định</span>
                        </div>
                    </div>
                </button>

                <div className="conv-section">
                    <span>TẤT CẢ CUỘC HỘI THOẠI</span>
                </div>

                <button className="conv-item active">
                    <div className="conv-avatar-wrap">
                        <div className="conv-avatar"><Hash size={20} /></div>
                        <span className="conv-online" />
                    </div>
                    <div className="conv-body">
                        <div className="conv-row">
                            <span className="conv-name">Frontend Team Project</span>
                            <span className="conv-time">10:42</span>
                        </div>
                        <div className="conv-row">
                            <span className="conv-last">David Kim: Đang gửi tin nhắn ...</span>
                            <span className="conv-badge">3</span>
                        </div>
                    </div>
                </button>
            </div>
        </section>
    )
}