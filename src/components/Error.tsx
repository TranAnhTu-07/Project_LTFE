import { Link } from 'react-router-dom'
import './Error.css'

export default function Error() {
    return (
        <div className="err-wrapper">
            <div className="err-code">404</div>
            <h2>Oops! Đã xảy ra lỗi</h2>
            <p>Đường dẫn không hợp lệ</p>
            <Link to="/" className="err-btn">Quay lại trang chủ</Link>
        </div>
    )
}