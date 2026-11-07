import { useEffect, useRef, useState, type FormEvent } from 'react'
import { X } from 'lucide-react'
import './Modal.css'

type Props = {
    onClose: () => void
    onSubmit: (name: string) => Promise<void> | void
}

export default function CreateRoomModal({ onClose, onSubmit }: Props) {
    const [name, setName] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    // Tự focus vào ô nhập khi mở
    useEffect(() => {
        inputRef.current?.focus()
    }, [])

    // Nhấn Esc để đóng
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [onClose])

    async function handleSubmit(e: FormEvent) {
        e.preventDefault()
        const value = name.trim()

        if (!value) {
            setError('Vui lòng nhập tên phòng')
            return
        }
        if (value.length > 30) {
            setError('Tên phòng tối đa 30 ký tự')
            return
        }

        setLoading(true)
        setError('')
        try {
            await onSubmit(value)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Có lỗi xảy ra')
            setLoading(false)
        }
    }

    return (
        <div
            className="modal-overlay"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) onClose()
            }}
        >
            <form className="modal-box" onSubmit={handleSubmit}>
                <div className="modal-header">
                    <h3>Tạo phòng chat</h3>
                    <button type="button" className="modal-close" onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>

                <p className="modal-desc">
                    Bạn sẽ là chủ phòng và là thành viên đầu tiên của phòng.
                </p>

                <label className="modal-label" htmlFor="room-name">
                    Tên phòng
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
                    placeholder="Ví dụ: LTFE"
                    disabled={loading}
                />
                {error && <p className="modal-error">{error}</p>}

                <div className="modal-actions">
                    <button type="button" className="modal-btn ghost" onClick={onClose}>
                        Hủy
                    </button>
                    <button type="submit" className="modal-btn primary" disabled={loading}>
                        {loading ? 'Đang tạo...' : 'Tạo phòng'}
                    </button>
                </div>
            </form>
        </div>
    )
}