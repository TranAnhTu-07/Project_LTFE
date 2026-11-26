import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import '../styles/Toast.css';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export type ToastItem = {
    id: string;
    message: string;
    type: ToastType;
};

type ToastContextType = {
    showToast: (message: string, type?: ToastType, duration?: number) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((item) => item.id !== id));
    }, []);

    const showToast = useCallback(
        (message: string, type: ToastType = 'info', duration = 3000) => {
            const id = Date.now().toString() + Math.random().toString(36).slice(2, 6);
            setToasts((prev) => [...prev, { id, message, type }]);

            if (duration > 0) {
                setTimeout(() => {
                    removeToast(id);
                }, duration);
            }
        },
        [removeToast]
    );

    const renderIcon = (type: ToastType) => {
        switch (type) {
            case 'success':
                return <CheckCircle size={18} className="toast-icon success" />;
            case 'error':
                return <XCircle size={18} className="toast-icon error" />;
            case 'warning':
                return <AlertCircle size={18} className="toast-icon warning" />;
            default:
                return <Info size={18} className="toast-icon info" />;
        }
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            <div className="toast-container">
                {toasts.map((toast) => (
                    <div key={toast.id} className={`toast-item ${toast.type}`}>
                        {renderIcon(toast.type)}
                        <span className="toast-message">{toast.message}</span>
                        <button
                            className="toast-close"
                            onClick={() => removeToast(toast.id)}
                            aria-label="Đóng thông báo"
                        >
                            <X size={15} />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast phải được dùng bên trong ToastProvider');
    }
    return context;
}