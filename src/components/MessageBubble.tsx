export type Message = {
    id: string;
    name: string;
    text: string;
    time: string;
    isOwn: boolean;
};

export default function MessageBubble({ message }: { message: Message }) {
    return (
        <div className={`message-row ${message.isOwn ? 'own' : ''}`}>
            <div className="message-content">
                <div className="message-sender"> {message.name} </div>
                <div className="message-bubble">
                    <div className="message-text"> {message.text} </div>
                    <span className="message-time"> {message.time} </span>
                </div>
            </div>
        </div>
    );
}