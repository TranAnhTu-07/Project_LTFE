import { Link } from 'react-router-dom'
import { ArrowLeft, LogOut } from 'lucide-react'
import './Profile.css'

export default function Profile() {
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
                        <div className="pf-avatar">T</div>
                        <div className="pf-identity">
                            <h1>Tên</h1>
                            <p>@Ten</p>
                        </div>
                        <span className="pf-status">
                            <span className="pf-dot" />
                            Đang hoạt động
                        </span>
                    </div>

                    <p className="pf-bio">Mô tả</p>
                </div>

                <div className="pf-card pf-section">
                    <h2>Thông tin tài khoản</h2>

                    <div className="pf-row">
                        <span className="pf-label">Tên đăng nhập</span>
                        <span className="pf-value">...</span>
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
                        defaultValue="....."
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
                        defaultValue="Mô tả ..."
                    />

                    <div className="pf-actions">
                        <button className="pf-btn primary">Lưu thay đổi</button>
                    </div>
                </div>

                <div className="pf-card pf-section">
                    <h2>Tài khoản</h2>
                    <button className="pf-btn danger">
                        <LogOut size={16} />
                        Đăng xuất
                    </button>
                </div>
            </div>
        </div>
    )
}