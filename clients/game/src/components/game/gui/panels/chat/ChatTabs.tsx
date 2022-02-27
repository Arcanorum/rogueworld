import styles from './ChatTabs.module.scss';
import { ChatState } from '../../../../../shared/state';
import { ChatScope } from '../../../../../shared/state/Chat';
import { getScopeColor } from './ChatPanel';
import getTextDef from '../../../../../shared/GetTextDef';

function ChatTabs({
    viewChatScope,
    updatePlaceHolder,
    setViewChatScope,
    setSendChatScope,
    focusOnChatInput,
    scrollChatToBottom,
}: {
    viewChatScope: string;
    updatePlaceHolder: () => void;
    setViewChatScope: (scope: ChatScope) => void;
    setSendChatScope: (scope: ChatScope) => void;
    focusOnChatInput: () => void;
    scrollChatToBottom: () => void;
}) {
    const isActiveTab = (scope: ChatScope) => (viewChatScope === scope ? styles.active : '');

    const handleChatTabClick = (scope: ChatScope) => {
        // don't set sendChat scope if player selected to view "ALL" tab
        if (scope !== ChatState.generalChatScope) {
            setSendChatScope(scope);
            ChatState.saveChatScope(scope);
        }
        ChatState.saveTabScope(scope);
        setViewChatScope(scope);
        focusOnChatInput();
        scrollChatToBottom();
        updatePlaceHolder();
    };

    const formatChatScope = (scope: ChatScope) => {
        const lowerCasedScope = scope.toLowerCase();
        return lowerCasedScope[0].toUpperCase() + lowerCasedScope.slice(1);
    };

    return (
        <div className={styles['chat-tabs-container']}>
            <p
                onClick={(e) => handleChatTabClick(ChatState.generalChatScope)}
                className={`${styles['chat-tab']} ${styles['all']} ${isActiveTab(ChatState.generalChatScope)}`}
            >
                {getTextDef('Chat scope: All')}
            </p>
            { Object.values(ChatState.Scopes).map((chatScope) => (
                <p
                    key={chatScope.value}
                    onClick={(e) => handleChatTabClick(chatScope.value)}
                    className={`${styles['chat-tab']} ${getScopeColor(chatScope.value)} ${isActiveTab(chatScope.value)}`}
                >
                    {getTextDef(`Chat scope: ${formatChatScope(chatScope.value)}`)}
                </p>
            ))}
        </div>
    );
}

export default ChatTabs;
