import { Link } from 'react-router-dom';
import './Login.css';

export default function Register() {
    return (
        <div className="login-wrapper">
            <div className="login-card">
                <h2>Đăng ký</h2>
                <input type="email" placeholder="Email" className="input" />
                <input type="text" placeholder="Tên đăng nhập" className="input" />
                <input type="password" placeholder="Mật khẩu" className="input" />
                <button className="btn-submit">Tạo tài khoản</button>
                <p>Đã có tài khoản? <Link to="/login" className="link">Đăng nhập</Link></p>
            </div>
        </div>
    );
}