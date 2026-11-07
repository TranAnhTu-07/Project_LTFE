import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from "./components/Login";
import Register from "./components/Register";
import ChatPage from "./components/ChatPage";
import Profile from "./components/Profile";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/profile" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/profile" element={<Profile />} />
            </Routes>
        </BrowserRouter>


    );
}