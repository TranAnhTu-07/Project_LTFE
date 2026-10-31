import { Search, MoreVertical, Paperclip, Smile, Send, Image, Mic } from 'lucide-react';

export default function ChatWindow() {
    return (
        <main className="chat-window">
            <div className="chat-window-inner">
                <header className="chat-header">
                    <div className="chat-header-info">
                        <h2>Alex Rivera</h2>
                        <span className="chat-header-status">Đang hoạt động</span>
                    </div>
                    <div className="chat-header-actions">
                        <button className="chat-icon-btn-simple" title="Tìm kiếm"><Search size={20} /></button>
                        <button className="chat-icon-btn-simple" title="Tùy chọn"><MoreVertical size={20} /></button>
                    </div>
                </header>

                <div className="chat-messages">
                    <p className="messages-placeholder">Khu vực hiển thị tin nhắn</p>
                </div>

                <footer className="chat-footer">
                    <div className="chat-input-wrapper">
                        <button className="chat-icon-btn-simple" title="Đính kèm tệp">
                            <Paperclip size={20} />
                        </button>
                        <button className="chat-icon-btn-simple" title="Gửi ảnh">
                            <Image size={20} />
                        </button>

                        <input
                            type="text"
                            placeholder="Nhập tin nhắn tới Alex..."
                            className="chat-input-field"
                        />

                        <button className="chat-icon-btn-simple" title="Ghi âm">
                            <Mic size={20} />
                        </button>
                        <button className="chat-icon-btn-simple" title="Gửi Emoji">
                            <Smile size={20} />
                        </button>

                        <button className="chat-send-btn">
                            <span>Gửi tin</span>
                            <Send size={16} />
                        </button>
                    </div>
                </footer>
            </div>
        </main>
    );
}