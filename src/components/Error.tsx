import { Link } from 'react-router-dom'

export default function Error() {
    return (
        <div>
            <h2>Oops! Đã xảy ra lỗi</h2>
            <p>Đường dẫn không hợp lệ</p>
            <Link to="/">Quay lại trang chủ</Link>
        </div>
    )
}