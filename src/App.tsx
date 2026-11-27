import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onConnectionStateChange, type ConnectionState, getConnectionState } from './api/socket';

import Login from "./pages/Login";
import Register from "./pages/Register";
import ChatPage from "./pages/ChatPage";
import Profile from "./pages/Profile";
import Error from "./pages/Error";
import { ToastProvider } from './context/ToastContext';

export default function App() {
    const [connState, setConnState] = useState<ConnectionState>(getConnectionState());

    useEffect(() => {
        const unsubscribe = onConnectionStateChange((newState) => {
            setConnState(newState);
        });
        return () => { unsubscribe() };
    }, []);

    const isLoggedIn = Boolean(localStorage.getItem('user'));
    const showDisconnectedBanner = connState === 'disconnected' && isLoggedIn;
    const showBanner = connState === 'reconnecting' || showDisconnectedBanner;

    return (
        <ToastProvider>
            <BrowserRouter>
                {connState === 'reconnecting' && (
                    <div style={{
                        background: '#ff9800', color: 'white', padding: '8px',
                        textAlign: 'center', position: 'fixed', top: 0, left: 0,
                        width: '100%', zIndex: 9999, fontWeight: 'bold'
                    }}>
                        Mất mạng! Đang tự động kết nối lại...
                    </div>
                )}
                {showDisconnectedBanner && (
                    <div style={{
                        background: '#f44336', color: 'white', padding: '8px',
                        textAlign: 'center', position: 'fixed', top: 0, left: 0,
                        width: '100%', zIndex: 9999, fontWeight: 'bold'
                    }}>
                        Đã ngắt kết nối với máy chủ.
                    </div>
                )}
                <div style={{
                    paddingTop: showBanner ? '40px' : '0',
                    height: '100vh',
                    boxSizing: 'border-box'
                }}>
                    <Routes>
                        <Route path="/" element={<Navigate to="/chat" />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/chat" element={<ChatPage />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/error" element={<Error />} />
                    </Routes>
                </div>
            </BrowserRouter>
        </ToastProvider>
    );
}