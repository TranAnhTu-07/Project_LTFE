import type { Conversation } from '../types'
import DirectInfo from './DirectInfo'
import GroupInfo from './GroupInfo'

type Props = { conversation: Conversation; onLeave: () => void }

export default function InfoPanel({ conversation, onLeave }: Props) {
    return conversation.type === 'direct'
        ? <DirectInfo conversation={conversation} onDelete={onLeave} />
        : <GroupInfo conversation={conversation} onLeave={onLeave} />
}