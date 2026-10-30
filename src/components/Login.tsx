import { Link } from 'react-router-dom';
import './Login.css';

export default function Login() {
    return (
        <div className="login-wrapper">
            <div className="login-card">
                <h2>Đăng nhập</h2>
                <input type="text" placeholder="Tên đăng nhập" className="input" />
                <input type="password" placeholder="Mật khẩu" className="input" />
                <button className="btn-submit">Vào Chat</button>
                <p>Chưa có tài khoản? <Link to="/register" className="link">Đăng ký</Link></p>
            </div>
        </div>
    );
}