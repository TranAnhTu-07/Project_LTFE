import { useEffect, useRef, useState, type FormEvent } from 'react'
import { X } from 'lucide-react'
import '../styles/Modal.css'

export type ModalMode = 'direct' | 'create' | 'join'

type Props = {
    onClose: () => void
    onSubmit: (name: string, mode: ModalMode) => Promise<void> | void
}

export default function CreateRoomModal({ onClose, onSubmit }: Props) {
    const [name, setName] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [mode, setMode] = useState<ModalMode>('direct')
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        inputRef.current?.focus()
    }, [])

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [onClose])

    const isRoom = mode !== 'direct'

    async function handleSubmit(e: FormEvent) {
        e.preventDefault()
        const value = name.trim()

        if (!value) {
            setError(isRoom ? 'Vui lòng nhập tên phòng' : 'Vui lòng nhập tên người nhận')
            return
        }
        if (value.length > 30) {
            setError('Tên phòng tối đa 30 ký tự')
            return
        }
        if (!isRoom && !/^[a-zA-Z0-9_]+$/.test(value)) {
            setError('Tên đăng nhập chỉ gồm chữ không dấu, số và dấu gạch dưới')
            return
        }

        setLoading(true)
        setError('')
        try {
            await onSubmit(value, mode)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Lỗi')
            setLoading(false)
        }
    }

    const submitLabel =
        mode === 'create' ? 'Tạo phòng' : mode === 'join' ? 'Vào phòng' : 'Nhắn tin'

    return (
        <div
            className="modal-overlay"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) onClose()
            }}
        >
            <form className="modal-box" onSubmit={handleSubmit}>
                <div className="modal-header">
                    <h3>Cuộc trò chuyện mới</h3>
                    <button type="button" className="modal-close" onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>

                <label className="modal-label" htmlFor="room-name">
                    {isRoom ? 'Tên phòng' : 'Tên người nhận'}
                </label>
                <input
                    id="room-name"
                    ref={inputRef}
                    className={`modal-input ${error ? 'error' : ''}`}
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value)
                        setError('')
                    }}
                />
                {error && <p className="modal-error">{error}</p>}

                <label className="modal-check">
                    <input
                        type="checkbox"
                        checked={mode === 'create'}
                        onChange={(e) => {
                            setMode(e.target.checked ? 'create' : 'direct')
                            setError('')
                        }}
                        disabled={loading}
                    />
                    <span>Tạo phòng</span>
                </label>

                <label className="modal-check">
                    <input
                        type="checkbox"
                        checked={mode === 'join'}
                        onChange={(e) => {
                            setMode(e.target.checked ? 'join' : 'direct')
                            setError('')
                        }}
                        disabled={loading}
                    />
                    <span>Vào phòng</span>
                </label>

                <div className="modal-actions">
                    <button type="button" className="modal-btn ghost" onClick={onClose}>
                        Hủy
                    </button>
                    <button type="submit" className="modal-btn primary" disabled={loading}>
                        {loading ? 'Đang xử lý...' : submitLabel}
                    </button>
                </div>
            </form>
        </div>
    )
}