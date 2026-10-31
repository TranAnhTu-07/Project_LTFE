import { MessageSquare, AtSign, Users, FolderOpen, Settings } from 'lucide-react'

const items = [MessageSquare, AtSign, Users, FolderOpen]

export default function Sidebar() {
    return (
        <aside className="chat-sidebar">
            <div className="chat-logo">PC</div>

            <nav className="chat-sidebar-nav">
                {items.map((Icon, i) => (
                    <button
                        key={i}
                        className={`chat-icon-btn ${i === 0 ? 'active' : ''}`}
                    >
                        <Icon size={20} />
                    </button>
                ))}
            </nav>

            <button className="chat-icon-btn">
                <Settings size={20} />
            </button>
        </aside>
    )
}