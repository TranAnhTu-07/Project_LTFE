export type Message = {
    id: string;
    text: string;
    time: string;
    isOwn: boolean;
};

export default function MessageBubble({ message }: { message: Message }) {
    return (
        <div className={`message-row ${message.isOwn ? 'own' : ''}`}>
            <div className="message-bubble">
                <div style={{ whiteSpace: 'pre-wrap' }}>{message.text}</div>
                <span className="message-time">{message.time}</span>
            </div>
        </div>
    );
}