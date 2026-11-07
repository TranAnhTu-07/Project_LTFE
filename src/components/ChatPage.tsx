import './ChatPage.css'
import Sidebar from './Sidebar'
import {ConversationList} from './ConversationList'
import ChatWindow from './ChatWindow'
import InfoPanel from './InfoPanel'
import {useState} from "react";

export default function ChatPage() {
    const [showInfo, setShowInfo] = useState(true);
    return (
        <div className={`chat-page ${!showInfo ? 'panel-hidden' : ''}`}>
            <Sidebar />
            <ConversationList />
            <ChatWindow onToggleInfo={() => setShowInfo(!showInfo)} />
            {showInfo && <InfoPanel />}
        </div>
    )
}