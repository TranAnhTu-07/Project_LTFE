import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from "./pages/Login";
import Register from "./pages/Register";
import ChatPage from "./pages/ChatPage";
import Profile from "./pages/Profile";
import Error from "./pages/Error";
import Contacts from "./pages/Contacts";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/chat" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/error" element={<Error />} />
                <Route path="/contacts" element={<Contacts />} />
            </Routes>
        </BrowserRouter>

    );
}