import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, LogOut } from 'lucide-react'
import { ensureLogin, logout } from '../api/auth.ts'
import './Profile.css'

export default function Profile() {
    const navigate = useNavigate()

    const username = localStorage.getItem('user') || ''
    const storageKey = `profile_${username}`

    const [displayName, setDisplayName] = useState(() => {
        try {
            const saved = JSON.parse(localStorage.getItem(storageKey) || '{}')
            return saved.displayName || username
        } catch {
            return username
        }
    })

    const [bio, setBio] = useState(() => {
        try {
            const saved = JSON.parse(localStorage.getItem(storageKey) || '{}')
            return saved.bio || ''
        } catch {
            return ''
        }
    })

    const [savedMsg, setSavedMsg] = useState(false)

    useEffect(() => {
        ensureLogin().catch(() => {
            navigate('/login', { replace: true })
        })
    }, [navigate])

    function handleSave() {
        const cleanName = displayName.trim() || username
        setDisplayName(cleanName)
        localStorage.setItem(storageKey, JSON.stringify({ displayName: cleanName, bio: bio.trim() }))
        setSavedMsg(true)
        setTimeout(() => setSavedMsg(false), 2500)
    }

    async function handleLogout() {
        try {
            await logout()
        } finally {
            navigate('/login', { replace: true })
        }
    }

    const avatarLetter = (displayName.trim()[0] || username[0] || '?').toUpperCase()

    return (
        <div className="pf-page">
            <div className="pf-container">
                <Link to="/chat" className="pf-back">
                    <ArrowLeft size={18} />
                    <span>Quay lại trò chuyện</span>
                </Link>

                <div className="pf-card">
                    <div className="pf-banner" />

                    <div className="pf-top">
                        <div className="pf-avatar">{avatarLetter}</div>
                        <div className="pf-identity">
                            <h1>{displayName || username}</h1>
                            <p>@{username}</p>
                        </div>
                        <span className="pf-status">
                            <span className="pf-dot" />
                            Đang hoạt động
                        </span>
                    </div>

                    <p className="pf-bio">{bio || 'Chưa có giới thiệu.'}</p>
                </div>

                <div className="pf-card pf-section">
                    <h2>Thông tin tài khoản</h2>

                    <div className="pf-row">
                        <span className="pf-label">Tên đăng nhập</span>
                        <span className="pf-value">{username}</span>
                    </div>
                    <div className="pf-row">
                        <span className="pf-label">Trạng thái</span>
                        <span className="pf-value pf-green">Đang hoạt động</span>
                    </div>
                </div>

                <div className="pf-card pf-section">
                    <h2>Chỉnh sửa hồ sơ</h2>

                    <label className="pf-field-label" htmlFor="pf-name">
                        Tên hiển thị
                    </label>
                    <input
                        id="pf-name"
                        className="pf-input"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        autoComplete="off"
                    />

                    <label className="pf-field-label" htmlFor="pf-bio">
                        Giới thiệu
                    </label>
                    <textarea
                        id="pf-bio"
                        className="pf-input pf-textarea"
                        rows={3}
                        placeholder="Vài dòng về bạn..."
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                    />

                    <div className="pf-actions">
                        {savedMsg && (
                            <span className="pf-green" style={{ marginRight: 'auto', alignSelf: 'center', fontSize: 13 }}>
                                Đã lưu thay đổi!
                            </span>
                        )}
                        <button type="button" className="pf-btn primary" onClick={handleSave}>
                            Lưu thay đổi
                        </button>
                    </div>
                </div>

                <div className="pf-card pf-section">
                    <h2>Tài khoản</h2>
                    <button type="button" className="pf-btn danger" onClick={handleLogout}>
                        <LogOut size={16} />
                        Đăng xuất
                    </button>
                </div>
            </div>
        </div>
    )
}