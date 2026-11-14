import {MessageSquare, AtSign, Users, FolderOpen, LogOut} from 'lucide-react'
import { useNavigate} from "react-router-dom";
import {logout} from "../api/auth.ts";

const items = [MessageSquare, AtSign, Users, FolderOpen]

export default function Sidebar() {
    const navigate = useNavigate();

    async function handleLogout() {
        try{
            await logout();

        }finally {
            navigate('/login', { replace: true });
        }
    }
    return (
        <aside className="chat-sidebar">
            <div className="chat-logo" onClick={() => navigate('/profile')} title="Hồ sơ cá nhân"
                 style={{ cursor: 'pointer' }}>PC</div>

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

            <button className="chat-icon-btn" onClick={handleLogout} title="Đăng xuất">
                <LogOut size={20} />
            </button>
        </aside>
    )
}