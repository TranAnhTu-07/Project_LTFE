import {Link, useNavigate} from 'react-router-dom';
import './Login.css';
import { useState, type SyntheticEvent } from "react";
import {register} from "../api/auth.ts";

export default function Register() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleRegister = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');

        const user = username.trim();

        if(!/^[a-zA-Z0-9_]+$/.test(user)) {
            setErrorMsg('Tên đăng nhập chỉ gồm chữ cái a-z, số 0-9 và dấu gạch dưới (_)');
            return;
        }
        if(user.length <3 || user.length > 15) {
            setErrorMsg('Tên đăng nhập phải từ 3 đến 20 ký tự');
            return;
        }
        if(password.length < 6) {
            setErrorMsg('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }
        if(password !== confirmPassword) {
            setErrorMsg('Mật khẩu không khớp');
            return;
        }
        setIsLoading(true);
        try {
            await register(user, password);
            setSuccessMsg('Đăng ký thành công');
            setTimeout(() => navigate('/login',{ state: { username: user, password } }), 1500);
        }catch (error: any) {
            setErrorMsg(error.message);
        }finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="login-wrapper">
            <div className="login-card">
                <h2>Đăng ký</h2>
                {errorMsg && <div style={{ color: '#ef4444', marginBottom: '12px', fontSize: '14px', textAlign: 'center' }}>{errorMsg}</div>}
                {successMsg && <div style={{ color: '#10b981', marginBottom: '12px', fontSize: '14px', textAlign: 'center' }}>{successMsg}</div>}
                <form onSubmit={handleRegister}>
                    <input
                        type="text" placeholder="Tên đăng nhập (a-z, 0-9, _)" className="input"
                        value={username} onChange={(e) => setUsername(e.target.value)}
                        disabled={isLoading} required
                    />
                    <input
                        type="password" placeholder="Mật khẩu(ít nhất 6 ký tự)" className="input"
                        value={password} onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading} required
                    />
                    <input
                        type="password" placeholder="Nhập lại mật khẩu" className="input"
                        value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={isLoading} required
                    />
                    <button type="submit" className="btn-submit" disabled={isLoading || !!successMsg}>
                        {isLoading ? 'Đang xử lý...' : 'Tạo tài khoản'}
                    </button>
                </form>
                <p>Đã có tài khoản? <Link to="/login" className="link">Đăng nhập</Link></p>
            </div>
        </div>
    );
}