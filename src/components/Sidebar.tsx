import { MessageSquare, Users, LogOut, type LucideIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { logout } from '../api/auth.ts'
import {resetConversations} from "../store/conversationsSlice.ts";
import {useDispatch} from "react-redux";

export type SidebarView = 'chat' | 'contacts'

const items: { view: SidebarView; icon: LucideIcon; title: string }[] = [
    { view: 'chat', icon: MessageSquare, title: 'Tin nhắn' },
    { view: 'contacts', icon: Users, title: 'Danh bạ' },
]

type Props = {
    view: SidebarView
    onChange: (view: SidebarView) => void
}

export default function Sidebar({ view, onChange }: Props) {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    async function handleLogout() {
        try {
            await logout()
        } finally {
            dispatch(resetConversations())
            navigate('/login', { replace: true })
        }
    }

    // async function handleLogout() {
    //     try {
    //         await logout()
    //     } finally {
    //         navigate('/login', { replace: true })
    //     }
    // }

    return (
        <aside className="chat-sidebar">
            <div
                className="chat-logo"
                onClick={() => navigate('/profile')}
                title="Hồ sơ cá nhân"
                style={{ cursor: 'pointer' }}
            >
                PC
            </div>

            <nav className="chat-sidebar-nav">
                {items.map(({ view: v, icon: Icon, title }) => (
                    <button
                        key={v}
                        title={title}
                        className={`chat-icon-btn ${view === v ? 'active' : ''}`}
                        onClick={() => onChange(v)}
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