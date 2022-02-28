import styles from './ChatLine.module.scss';
import { getScopeColor } from './ChatPanel';
import { ChatScope } from '../../../../../shared/state/Chat';

function ChatLine({
    scope,
    displayName,
    content,
}: {
    scope: ChatScope;
    displayName: string;
    content: string;
}) {
    return (
        <p className={`${styles['chat-line']} ${getScopeColor(scope)}`}>
            <span className={styles['display-name']}>{`${displayName}: `}</span>
            <span>{content}</span>
        </p>
    );
}

export default ChatLine;
