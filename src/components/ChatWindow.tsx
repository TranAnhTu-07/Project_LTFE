import { useState, useRef, useEffect, type KeyboardEvent, type ChangeEvent } from 'react';
import { Search, MoreVertical, Paperclip, Smile, Send, Image, Mic } from 'lucide-react';
import MessageBubble, { type Message } from './MessageBubble';
import type { Conversation } from '../types'

type ChatWindowProps = {
    conversation: Conversation | null
    onToggleInfo?: () => void;
};

export default function ChatWindow({ conversation, onToggleInfo }: ChatWindowProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(e.target.value);
        if (textareaRef.current) {
            textareaRef.current.style.height = '24px';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    };

    const handleSend = () => {
        if (!inputValue.trim()) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            text: inputValue.trim(),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isOwn: true
        };

        setMessages(prev => [...prev, newMessage]);
        setInputValue('');

        if (textareaRef.current) {
            textareaRef.current.style.height = '24px';
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (!conversation) {
        return (
            <main className="chat-window">
                <p className="chat-empty">Chọn một cuộc trò chuyện để bắt đầu</p>
            </main>
        )
    }

    const status =
        conversation.type === 'direct'
            ? conversation.online ? 'Đang hoạt động' : 'Ngoại tuyến'
            : `${conversation.members?.length ?? 0} thành viên`

    return (
        <main className="chat-window">
            <div className="chat-window-inner">
                <header className="chat-header">
                    <div className="chat-header-info">
                        <h2>{conversation.name}</h2>
                        <span className="chat-header-status">{status}</span>
                    </div>
                    <div className="chat-header-actions">
                        <button className="chat-icon-btn-simple" title="Tìm kiếm">
                            <Search size={20} />
                        </button>
                        <button
                            className="chat-icon-btn-simple"
                            title="Thông tin hội thoại"
                            onClick={onToggleInfo}
                        >
                            <MoreVertical size={20} />
                        </button>
                    </div>
                </header>

                <div className="chat-messages" style={{ display: 'block' }}>
                    {messages.map(msg => (
                        <MessageBubble key={msg.id} message={msg} />
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <footer className="chat-footer">
                    <div className="chat-input-wrapper">
                        <button className="chat-icon-btn-simple"><Paperclip size={20} /></button>
                        <button className="chat-icon-btn-simple"><Image size={20} /></button>

                        <textarea
                            ref={textareaRef}
                            value={inputValue}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            placeholder="Nhập tin nhắn (Shift+Enter để xuống dòng)..."
                            className="chat-input-field textarea"
                            rows={1}
                        />
                        <button className="chat-icon-btn-simple"><Mic size={20} /></button>
                        <button className="chat-icon-btn-simple"><Smile size={20} /></button>
                        <button className="chat-send-btn" onClick={handleSend}>
                            <span>Gửi</span>
                            <Send size={16} />
                        </button>
                    </div>
                </footer>
            </div>
        </main>
    );
}