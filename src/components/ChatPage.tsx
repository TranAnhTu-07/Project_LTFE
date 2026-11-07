import './ChatPage.css'
import { useState } from 'react'
import Sidebar from './Sidebar'
import { ConversationList } from './ConversationList'
import ChatWindow from './ChatWindow'
import InfoPanel from './InfoPanel'
import { conversations as initialData } from '../data/mockData'
import type { Conversation } from '../types'

export default function ChatPage() {
    const [showInfo, setShowInfo] = useState(true)
    const [list, setList] = useState<Conversation[]>(initialData)
    const [activeId, setActiveId] = useState<string | null>('3')

    const active = list.find((c) => c.id === activeId) ?? null

    function handleCreate(room: Conversation) {
        setList((prev) => [room, ...prev])
        setActiveId(room.id)
    }

    function handleLeave(id: string) {
        setList((prev) => prev.filter((c) => c.id !== id))
        setActiveId(null)
    }

    return (
        <div className={`chat-page ${!showInfo ? 'panel-hidden' : ''}`}>
            <Sidebar />
            <ConversationList
                list={list}
                activeId={activeId}
                onSelect={setActiveId}
                onCreate={handleCreate}
            />
            <ChatWindow
                key={active?.id}
                conversation={active}
                onToggleInfo={() => setShowInfo(!showInfo)}
            />
            {showInfo && active && (
                <InfoPanel conversation={active} onLeave={() => handleLeave(active.id)} />
            )}
        </div>
    )
}