import {Link, useNavigate} from 'react-router-dom';
import './Login.css';
import { useState, type SyntheticEvent } from "react";
import {login} from "../api/auth.ts";

export default function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const[isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');


    const handleLogin = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg('');
        try {
            await login(username.trim(), password);
            navigate('/chat');
        }catch (error: any) {
            setErrorMsg(error.message);
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="login-wrapper">
            <div className="login-card">
                <h2>Đăng nhập</h2>
                {errorMsg && <div style={{ color: '#ef4444', marginBottom: '12px', fontSize: '14px', textAlign: 'center' }}>{errorMsg}</div>}
                <form onSubmit={handleLogin}>
                    <input
                        type="text" placeholder="Tên đăng nhập " className="input"
                        value={username} onChange={(e) => setUsername(e.target.value)}
                        disabled={isLoading} required/>
                    <input
                        type="password" placeholder="Mật khẩu" className="input"
                        value={password} onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading} required/>
                    <button type="submit" className="btn-submit" disabled={isLoading}>{isLoading ? 'Đang kết nối...' : 'Vào Chat'}</button>
                </form>
                <p>Chưa có tài khoản? <Link to="/register" className="link">Đăng ký</Link></p>
            </div>
        </div>
    );
}