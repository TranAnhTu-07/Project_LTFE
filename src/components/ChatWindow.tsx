import { useState, useRef, useEffect, type KeyboardEvent, type ChangeEvent, useCallback } from 'react';
import { Search, MoreVertical, Paperclip, Smile, Send, Image, Mic, Hash, Users } from 'lucide-react';
import MessageBubble, { type Message } from './MessageBubble';
import type { Conversation } from '../types'

import { request } from '../api/socket';

type ChatWindowProps = {
    conversation: Conversation | null
    onToggleInfo?: () => void;
};

export default function ChatWindow({ conversation, onToggleInfo }: ChatWindowProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [inputValue, setInputValue] = useState('');

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const loadingRef = useRef(false);
    const activeRoomRef = useRef(conversation?.id);

    const previousHeightRef = useRef(0);
    const shouldKeepScrollRef = useRef(false);
    const isFirstLoadRef = useRef(true);

    const convertMessages = (data: any[]): Message[] => {
        const currentUser = localStorage.getItem('user');

        return data.map((item) => ({
            id: String(item.id),
            name: item.name,
            text: item.mes,
            time: item.createAt,
            isOwn: item.name === currentUser
        }));
    };

    //tải tin nhắn
    const loadMessages = useCallback(async (currentPage: number) => {

        if (!conversation || loadingRef.current) return;

        const roomId = conversation.id;

        loadingRef.current = true;
        setLoading(true);
        setError('');

        try {
            const res = await request('CHAT_PEOPLE_GET_MES', {
                name: conversation.name,
                page: currentPage
            });

            // Kiểm tra người dùng còn ở phòng cũ không
            if (activeRoomRef.current !== roomId) return;

            const chatMess = res.data?.chatMess ?? [];
            const newMessages = convertMessages(chatMess);

            if (currentPage === 1) {
                setMessages(newMessages);
            } else {
                setMessages(prev => {
                    const oldIds = new Set(prev.map(m => m.id));

                    const uniqueMessages = newMessages.filter(
                        m => !oldIds.has(m.id)
                    );

                    return [...uniqueMessages, ...prev];
                });
            }

            setPage(currentPage);
            setHasMore(chatMess.length === 50);

        } catch (err) {

            if (activeRoomRef.current === roomId) {
                setError(
                    err instanceof Error
                        ? err.message
                        : 'Không tải được tin nhắn'
                );
            }

        } finally {

            loadingRef.current = false;

            if (activeRoomRef.current === roomId) {
                setLoading(false);
            }
        }

    }, [conversation?.id, conversation?.name]);

    //khi đổi phòng
    useEffect(() => {
        activeRoomRef.current = conversation?.id;

        setMessages([]);
        setPage(1);
        setHasMore(true);
        setError('');
        setInputValue('');

        loadingRef.current = false;
        shouldKeepScrollRef.current = false;
        isFirstLoadRef.current = true;

        if (conversation) {
            loadMessages(1);
        } else {
            setLoading(false);
        }

    }, [conversation?.id, loadMessages]);

    useEffect(() => {

        const container = messagesRef.current;

        if (!container || loading) return;

        if (shouldKeepScrollRef.current) {

            const newHeight = container.scrollHeight;

            container.scrollTop +=
                newHeight - previousHeightRef.current;

            shouldKeepScrollRef.current = false;

        } else if (isFirstLoadRef.current && messages.length > 0) {

            messagesEndRef.current?.scrollIntoView({
                behavior: 'auto'
            });

            isFirstLoadRef.current = false;
        }

    }, [messages, loading]);

    const handleLoadMore = () => {

        if (!hasMore || loading || !messagesRef.current) return;

        previousHeightRef.current = messagesRef.current.scrollHeight;

        shouldKeepScrollRef.current = true;

        loadMessages(page + 1);
    };

    const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {

        setInputValue(e.target.value);

        if (textareaRef.current) {
            textareaRef.current.style.height = '24px';

            textareaRef.current.style.height =
                `${textareaRef.current.scrollHeight}px`;
        }

    };

    const handleSend = () => {

        if (!inputValue.trim()) return;

        const currentUser = localStorage.getItem('user') ?? '';

        const newMessage: Message = {
            id: Date.now().toString(),
            name: currentUser,
            text: inputValue.trim(),
            time: new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
            }),
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

    const members = conversation.members ?? [];

    const status =
        conversation.type === 'direct'
            ? conversation.online ? 'Đang hoạt động' : 'Ngoại tuyến'
            : `${members.length} thành viên`

            // Avatar thành viên trong phòng
    const displayMembers = members.slice(0, 3);

    // Hiển thị màn hình chào khi chưa có tin nhắn
    const renderEmptyChat = () => {

        if (conversation.type === 'channel') {
            return (
                <div className="chat-welcome">

                    <div className="welcome-avatars">
                        {displayMembers.length > 0 ? (
                            displayMembers.map(member => (
                                <div
                                    className="welcome-avatar"
                                    key={member.id}
                                >
                                    <img
                                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=6366f1&color=fff&size=100`}
                                        alt={member.name}
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="welcome-default-avatar">
                                <Hash size={34} />
                            </div>
                        )}
                    </div>

                    <h2>{conversation.name}</h2>

                    <div className="welcome-member-count">
                        <Users size={16} />
                        <span>
                            Tổng cộng {members.length} thành viên
                        </span>
                    </div>

                    <p>
                        Đây là điểm bắt đầu của cuộc trò chuyện.
                    </p>

                </div>
            );
        }
        return (
            <div className="chat-welcome">

                <div className="welcome-default-avatar">
                    <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(conversation.name)}&background=6366f1&color=fff&size=100`}
                        alt={conversation.name}
                    />
                </div>

                <h2>{conversation.name}</h2>

                <p>
                    Hãy bắt đầu cuộc trò chuyện.
                </p>

            </div>
        );
    };

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

                <div className="chat-messages" ref={messagesRef} style={{ display: 'block' }}>
                    {loading && messages.length === 0 && (
                        <div className="chat-loading">
                            <div className="loading-spinner" />
                            <p>Đang tải tin nhắn...</p>
                        </div>
                    )}

                    {error && (
                        <p className="chat-error">
                            {error}
                        </p>
                    )}

                    {!loading && !error && messages.length === 0 && (
                        renderEmptyChat()
                    )}
                    
                    {messages.length > 0 && hasMore && (
                        <button
                        className="load-more-btn"
                        onClick={handleLoadMore}
                        disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="loading-spinner small" />
                                    Đang tải tin cũ...
                                </>
                            ) : (
                                'Tải thêm tin cũ'
                            )}
                        </button>
                    )}

                    {messages.map(msg => (
                        <MessageBubble
                            key={msg.id}
                            message={msg}
                        />
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