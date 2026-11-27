import '../styles/ChatPage.css'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { ConversationList } from '../components/ConversationList.tsx'
import ChatWindow from '../components/ChatWindow.tsx'
import InfoPanel from '../components/InfoPanel.tsx'
import type { ChatMessage, Conversation } from '../types.ts'
import type { AppDispatch, RootState } from '../store'
import Sidebar, { type SidebarView } from '../components/Sidebar.tsx'
import Contacts from './Contacts.tsx'

import {
    setActive,
    addConversation,
    removeConversation,
    appendMessage,
} from '../store/conversationsSlice'
import { ensureLogin } from '../api/auth.ts'
import {  outRoom, onChatMessage, onChatError } from '../api/chat.ts'
import { useToast } from '../context/ToastContext'
import {nowActionTime} from "../utils/conversation.ts";

export default function ChatPage() {
    const [showInfo, setShowInfo] = useState(true)
    const [isAuthReady, setIsAuthReady] = useState(false)

    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const { showToast } = useToast()
    const [view, setView] = useState<SidebarView>('chat')

    const { list, activeId } = useSelector((state: RootState) => state.conversations)

    useEffect(() => {
        let cancelled = false
        ensureLogin()
            .then(() => {
                if (!cancelled) setIsAuthReady(true)
            })
            .catch(() => {
                if (!cancelled) navigate('/login', { replace: true })
            })
        return () => {
            cancelled = true
        }
    }, [navigate])

    useEffect(() => {
        if (!isAuthReady) return

        const offMsg = onChatMessage((msg: ChatMessage) => {
            dispatch(appendMessage({ ...msg, createAt: msg.createAt ?? nowActionTime() }))
        })

        const offErr = onChatError((errMes) => {
            showToast(errMes, 'error')
        })

        return () => {
            offMsg()
            offErr()
        }
    }, [isAuthReady, dispatch, showToast])

    if (!isAuthReady) {
        return (
            <div style={{ padding: '24px', textAlign: 'center' }}>
                Đang khôi phục phiên đăng nhập...
            </div>
        )
    }

    const active = list.find((c) => c.id === activeId) ?? null

    function handleSelectConversation(id: string) {
        dispatch(setActive(id))
    }

    async function handleCreate(conv: Conversation) {
        try {
            // await createRoom(room.name)
            dispatch(addConversation(conv))
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Tạo phòng thất bại'
            showToast(msg, 'error')
        }
    }

    async function handleLeave(conv: Conversation) {
        try {
            if (conv.type === 'room') {
                await outRoom(conv.name)
            }
            dispatch(removeConversation(conv.id))
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Không thể rời cuộc trò chuyện'
            showToast(msg, 'error')
        }
    }

    return (
        <div className={`chat-page ${!showInfo ? 'panel-hidden' : ''}`}>
            <Sidebar view={view} onChange={setView} />

            {view === 'chat' ? (
                <>
                    <ConversationList
                        activeId={activeId}
                        onSelect={handleSelectConversation}
                        onCreate={handleCreate}
                    />
                    <ChatWindow
                        key={active?.id ?? 'empty'}
                        conversation={active}
                        onToggleInfo={() => setShowInfo(!showInfo)}
                    />
                    {showInfo && active && (
                        <InfoPanel conversation={active} onLeave={() => handleLeave(active)} />
                    )}
                </>
            ) : (
                <Contacts
                    onOpen={(id) => {
                        handleSelectConversation(id)
                        setView('chat')
                    }}
                />
            )}
        </div>
    )
}