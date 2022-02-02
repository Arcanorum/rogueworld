import './ChatLine.scss';
import { getScopeColor } from './ChatPanel';
import { ChatScope } from '../../../../../shared/state/Chat';

function ChatLine({
    scope,
    displayName,
    message,
}: {
    scope: ChatScope;
    displayName: string;
    message: string;
}) {
    return (
        <p className={`chat-line ${getScopeColor(scope)}`}>
            <span className="display-name">{`${displayName}: `}</span>
            <span>{message}</span>
        </p>
    );
}

export default ChatLine;
