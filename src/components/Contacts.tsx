import { Search, ArrowUpDown, Filter, ChevronDown, MoreHorizontal } from 'lucide-react'
import './Contacts.css'

type RowProps = {
    name: string
    color: 1 | 2 | 3 | 4
    online?: boolean
}

function Row({ name, color, online }: RowProps) {
    return (
        <div className="ct-row">
            <div className="ct-avatar-wrap">
                <div className={`ct-avatar c${color}`}>{name[0].toUpperCase()}</div>
                {online && <span className="ct-online" />}
            </div>
            <span className="ct-name">{name}</span>
            <button className="ct-more" title="Tùy chọn">
                <MoreHorizontal size={30} />
            </button>
        </div>
    )
}

export default function Contacts() {
    return (
        <main className="ct-page">
            <header className="ct-header">
                <h2>Danh bạ (6)</h2>
            </header>

            <div className="ct-body">
                <div className="ct-toolbar">
                    <div className="ct-search">
                        <Search size={16} />
                        <input placeholder="Tìm bạn" />
                    </div>

                    <div className="ct-select">
                        <ArrowUpDown size={16} className="ct-select-icon" />
                        <select defaultValue="az">
                            <option value="az">Tên (A-Z)</option>
                            <option value="za">Tên (Z-A)</option>
                        </select>
                        <ChevronDown size={16} className="ct-select-arrow" />
                    </div>

                    <div className="ct-select">
                        <Filter size={16} className="ct-select-icon" />
                        <select defaultValue="all">
                            <option value="all">Tất cả</option>
                            <option value="online">Đang online</option>
                        </select>
                        <ChevronDown size={16} className="ct-select-arrow" />
                    </div>
                </div>

                <div className="ct-list">
                    <div className="ct-letter">B</div>
                    <Row name="Ben" color={1} online />
                    <Row name="Bùi Chiến" color={2} />

                    <div className="ct-letter">C</div>
                    <Row name="Chu Thúy" color={3} online />


                </div>
            </div>
        </main>
    )
}