import { useState, useRef, useEffect, type KeyboardEvent, type ChangeEvent } from 'react';
import { Search, MoreVertical, Send, Hash, Users, X, ChevronUp, ChevronDown, ArrowLeft } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import MessageBubble, { type Message } from './MessageBubble';
import type { ChatMessage, Conversation, Member } from '../types';
import type { AppDispatch, RootState } from '../store';
import { appendMessage, fetchConversationMessages, setConversationMembers, setConversationMessages } from '../store/conversationsSlice';
import { useToast } from '../context/ToastContext';
import { sendChat, joinRoom } from '../api/chat';
import {isRoomConversation, nowActionTime} from '../utils/conversation';

type ChatWindowProps = {
    conversation: Conversation | null;
    onToggleInfo?: () => void;
    onBackMobile?: () => void;
};

function extractRoomMembers(data: unknown): Member[] | undefined {
    if (!data || typeof data !== 'object') return undefined;
    const raw = data as Record<string, unknown>;
    const list = Array.isArray(raw.userList)
        ? raw.userList
        : Array.isArray(raw.user)
            ? raw.user
            : Array.isArray(raw.users)
                ? raw.users
                : Array.isArray(raw.members)
                    ? raw.members
                    : null;

    if (!list) return undefined;

    return list.map((item, idx) => {
        const u = (item ?? {}) as Record<string, unknown>;
        return {
            id: String(u.id ?? u._id ?? idx),
            name: String(u.name ?? u.username ?? 'Thành viên'),
            online: true,
        };
    });
}

export default function ChatWindow({ conversation, onToggleInfo, onBackMobile }: ChatWindowProps) {
    const dispatch = useDispatch<AppDispatch>();
    const { showToast } = useToast();

    const { list, messagesByConv, loadingMessages, messagesError } = useSelector(
        (state: RootState) => state.conversations
    );

    const [inputValue, setInputValue] = useState('');

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const liveConversation = conversation
        ? list.find((c) => c.id === conversation.id) ?? conversation
        : null;

    const rawMessages: ChatMessage[] = liveConversation
        ? messagesByConv[liveConversation.id] ?? []
        : [];

    const currentUser = localStorage.getItem('user') ?? '';
    const messages: Message[] = rawMessages.map((item, idx) => ({
        id: item.id !== undefined ? String(item.id) : `${item.name}-${item.createAt ?? ''}-${idx}`,
        name: item.name,
        text: item.mes,
        time: item.createAt ?? '',
        isOwn: item.name === currentUser,
    }));

    // xử lý tìm tin nhắn
    const [showSearch, setShowSearch] = useState(false); 
    const [searchQuery, setSearchQuery] = useState(''); 
    const [matchIndex, setMatchIndex] = useState(0); 
    const searchInputRef = useRef<HTMLInputElement>(null); 

    // lọc tin nhắn
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const matchedMessages = normalizedQuery
        ? messages.filter(
            (m) =>
                m.text.toLowerCase().includes(normalizedQuery) || 
                m.name.toLowerCase().includes(normalizedQuery)    
        )
        : [];

    // 3. Xác định tin nhắn khớp hiện tại đang được trỏ tới (dùng % để xoay vòng từ cuối về đầu và ngược lại)
    const activeMatch =
        matchedMessages.length > 0
            ? matchedMessages[matchIndex % matchedMessages.length]
            : null;

    useEffect(() => {
        setShowSearch(false);
        setSearchQuery('');
        setMatchIndex(0);
    }, [conversation?.id]);

    useEffect(() => {
        if (showSearch) {
            searchInputRef.current?.focus();
        }
    }, [showSearch]);

    // tự động cuộn tới vị trí tin nhắn khi tìm thấy
    useEffect(() => {
        if (!activeMatch || !messagesRef.current) return;
        const escapedId = activeMatch.id.replace(/"/g, '\\"');
        const targetEl = messagesRef.current.querySelector<HTMLElement>(
            `[data-msg-id="${escapedId}"]`
        );
        // Cuộn mượt đưa tin nhắn đó vào giữa vùng hiển thị
        targetEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, [activeMatch]);

    const handleToggleSearch = () => {
        setShowSearch((prev) => {
            const next = !prev;
            if (!next) {
                setSearchQuery('');
                setMatchIndex(0);
            }
            return next;
        });
    };

    const handleStepMatch = (delta: number) => {
        if (matchedMessages.length === 0) return;
        setMatchIndex(
            (prev) => (prev + delta + matchedMessages.length) % matchedMessages.length
        );
    };

    // console.log loại phòng khi mở và tải tin nhắn + danh sách thành viên
    useEffect(() => {
        if (!conversation) return;

        let cancelled = false;
        const roomMode = isRoomConversation(conversation);
        console.log(
            `[ChatWindow] Đang vào ${roomMode ? 'Phòng nhóm' : 'Chat 1-1'}:`,
            conversation.name,
            conversation
        );

        const initConversation = async () => {
            if (roomMode) {
                try {
                    const roomRes = await joinRoom(conversation.name);
                    if (cancelled) return;

                    console.log('[JOIN_ROOM] response:', roomRes);
                    const joinedMembers = extractRoomMembers(roomRes);
                    if (joinedMembers && joinedMembers.length > 0) {
                        dispatch(
                            setConversationMembers({
                                convId: conversation.id,
                                members: joinedMembers,
                            })
                        );
                    }
                    const rawObj = (roomRes ?? {}) as Record<string, unknown>
                    const joinedChatData = Array.isArray(rawObj.chatData)
                        ? (rawObj.chatData as ChatMessage[])
                        : Array.isArray(rawObj.chatMess)
                            ? (rawObj.chatMess as ChatMessage[])
                            : []

                    if (joinedChatData.length > 0) {
                        const sorted = [...joinedChatData].sort((a, b) => {
                            const ta = a.createAt ? Date.parse(a.createAt.replace(' ', 'T')) : 0
                            const tb = b.createAt ? Date.parse(b.createAt.replace(' ', 'T')) : 0
                            return (Number.isNaN(ta) ? 0 : ta) - (Number.isNaN(tb) ? 0 : tb)
                        })
                        dispatch(
                            setConversationMessages({
                                convId: conversation.id,
                                messages: sorted,
                            })
                        )
                    }
                } catch (err) {
                    if (cancelled) return;
                    const msg = err instanceof Error ? err.message : 'Không thể vào phòng';
                    showToast(msg, 'error');
                    if (msg.includes('Room not found')) {
                        return;
                    }
                }
            }

            if (cancelled) return;

            try {
                await dispatch(
                    fetchConversationMessages({
                        convId: conversation.id,
                        type: roomMode ? 'room' : 'direct',
                        name: conversation.name,
                    })
                ).unwrap();
            } catch (err) {
                if (cancelled) return;
                const msg = typeof err === 'string' ? err : 'Không tải được tin nhắn';
                showToast(msg, 'error');
            }
        };

        initConversation();

        return () => {
            cancelled = true;
        };
    }, [conversation?.id, conversation?.type, conversation?.name, dispatch, showToast]);

    // Cuộn xuống cuối khi tải xong hoặc khi có tin nhắn mới trong cuộc trò chuyện hiện tại
    useEffect(() => {
        if (!loadingMessages && messages.length > 0) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [liveConversation?.id, loadingMessages, messages.length]);

    const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(e.target.value);
        if (textareaRef.current) {
            textareaRef.current.style.height = '24px';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    };

    const handleSend = async () => {
        const content = inputValue.trim();
        if (!content || !liveConversation) return;

        const roomMode = isRoomConversation(liveConversation);
        const chatType: 'room' | 'people' = roomMode ? 'room' : 'people';
        const senderName = localStorage.getItem('user') ?? 'Bạn';

        setInputValue('');
        if (textareaRef.current) {
            textareaRef.current.style.height = '24px';
        }

        try {
            await sendChat(chatType, liveConversation.name, content);
            // const nowStr = new Date().toISOString().slice(0, 19).replace('T', ' ');
            const optimisticMsg: ChatMessage = {
                id: -Date.now(),
                name: senderName,
                type: roomMode ? 1 : 0,
                to: liveConversation.name,
                mes: content,
                createAt: nowActionTime(),
            };

            dispatch(appendMessage(optimisticMsg));
            requestAnimationFrame(() => {
                messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
            });
        } catch (err) {
            showToast(err instanceof Error ? err.message : 'Gửi tin nhắn thất bại', 'error');
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (!liveConversation) {
        return (
            <main className="chat-window">
                <p className="chat-empty">Chọn một cuộc trò chuyện để bắt đầu</p>
            </main>
        );
    }

    const roomMode = isRoomConversation(liveConversation);
    const members = liveConversation.members ?? [];
    const status = roomMode
        ? `${members.length} thành viên`
        : liveConversation.online
            ? 'Đang hoạt động'
            : 'Ngoại tuyến';
    const displayMembers = members.slice(0, 3);

    const renderEmptyChat = () => {
        if (roomMode) {
            return (
                <div className="chat-welcome">
                    <div className="welcome-avatars">
                        {displayMembers.length > 0 ? (
                            displayMembers.map((member) => (
                                <div className="welcome-avatar" key={member.id}>
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
                    <h2>{liveConversation.name}</h2>
                    <div className="welcome-member-count">
                        <Users size={16} />
                        <span>Tổng cộng {members.length} thành viên</span>
                    </div>
                    <p>Đây là điểm bắt đầu của cuộc trò chuyện.</p>
                </div>
            );
        }

        return (
            <div className="chat-welcome">
                <div className="welcome-default-avatar">
                    <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(liveConversation.name)}&background=6366f1&color=fff&size=100`}
                        alt={liveConversation.name}
                    />
                </div>
                <h2>{liveConversation.name}</h2>
                <p>Hãy bắt đầu cuộc trò chuyện.</p>
            </div>
        );
    };

    return (
        <main className="chat-window">
            <div className="chat-window-inner">
                <header className="chat-header">
                    <div className="chat-header-info">
                        {onBackMobile && (
                            <button
                                type="button"
                                className="chat-icon-btn-simple mobile-back-btn"
                                title="Danh sách hội thoại"
                                onClick={onBackMobile}
                            >
                                <ArrowLeft size={20} />
                            </button>
                        )}
                        <h2>{liveConversation.name}</h2>
                        <span className="chat-header-status">{status}</span>
                    </div>
                    <div className="chat-header-actions">
                        <button
                            className={`chat-icon-btn-simple ${showSearch ? 'active' : ''}`}
                            title="Tìm kiếm tin nhắn"
                            onClick={handleToggleSearch}
                        >
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

                {showSearch && (
                    <div className="chat-search-bar">
                        <Search size={16} />
                        <input
                            ref={searchInputRef}
                            type="text"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setMatchIndex(0);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleStepMatch(e.shiftKey ? -1 : 1);
                                } else if (e.key === 'Escape') {
                                    handleToggleSearch();
                                }
                            }}
                            placeholder="Tìm tin nhắn trong cuộc trò chuyện..."
                            className="chat-search-input"
                        />
                        {normalizedQuery && (
                            <span className="chat-search-count">
                                {matchedMessages.length > 0
                                    ? `${(matchIndex % matchedMessages.length) + 1}/${matchedMessages.length}`
                                    : '0/0'}
                            </span>
                        )}
                        <button
                            type="button"
                            className="chat-icon-btn-simple"
                            title="Tin nhắn trước"
                            disabled={matchedMessages.length === 0}
                            onClick={() => handleStepMatch(-1)}
                        >
                            <ChevronUp size={16} />
                        </button>
                        <button
                            type="button"
                            className="chat-icon-btn-simple"
                            title="Tin nhắn tiếp theo"
                            disabled={matchedMessages.length === 0}
                            onClick={() => handleStepMatch(1)}
                        >
                            <ChevronDown size={16} />
                        </button>
                        <button
                            type="button"
                            className="chat-icon-btn-simple"
                            title="Đóng tìm kiếm"
                            onClick={handleToggleSearch}
                        >
                            <X size={16} />
                        </button>
                    </div>
                )}

                <div className="chat-messages" ref={messagesRef} style={{ display: 'block' }}>
                    {loadingMessages && messages.length === 0 && (
                        <div className="chat-loading">
                            <div className="loading-spinner" />
                            <p>Đang tải tin nhắn...</p>
                        </div>
                    )}

                    {messagesError && <p className="chat-error">{messagesError}</p>}

                    {!loadingMessages && !messagesError && messages.length === 0 && renderEmptyChat()}

                    {messages.map((msg) => {
                        const isMatched =
                            !!normalizedQuery &&
                            (msg.text.toLowerCase().includes(normalizedQuery) ||
                                msg.name.toLowerCase().includes(normalizedQuery));
                        const isCurrentMatch = activeMatch?.id === msg.id;

                        return (
                            <div
                                key={msg.id}
                                data-msg-id={msg.id}
                                className={
                                    isCurrentMatch
                                        ? 'chat-msg-match active'
                                        : isMatched
                                            ? 'chat-msg-match'
                                            : undefined
                                }
                            >
                                <MessageBubble message={msg} />
                            </div>
                        );
                    })}

                    <div ref={messagesEndRef} />
                </div>

                <footer className="chat-footer">
                    <div className="chat-input-wrapper">
                        <textarea
                            ref={textareaRef}
                            value={inputValue}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            placeholder="Nhập tin nhắn (Shift+Enter để xuống dòng)..."
                            className="chat-input-field textarea"
                            rows={1}
                        />
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