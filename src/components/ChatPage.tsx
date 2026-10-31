import './ChatPage.css'
import Sidebar from './Sidebar'
import ConversationList from './ConversationList'
import ChatWindow from './ChatWindow'
import InfoPanel from './InfoPanel'

export default function ChatPage() {
    return (
        <div className="chat-page">
            <Sidebar />
            <ConversationList />
            <ChatWindow />
            <InfoPanel />
        </div>
    )
}