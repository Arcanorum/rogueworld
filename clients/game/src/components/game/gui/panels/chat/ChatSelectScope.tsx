import { ChatState } from '../../../../../shared/state';
import styles from './ChatSelectScope.module.scss';
import getTextDef from '../../../../../shared/GetTextDef';
import { ChatScope } from '../../../../../shared/state/Chat';
import chatPanelStyles from './ChatPanel.module.scss';

function ChatSelectScope({
    updatePlaceHolder,
    setSendChatScope,
    closeSelectScopeDropdown,
}: {
    updatePlaceHolder: () => void;
    setSendChatScope: (scope: ChatScope) => void;
    closeSelectScopeDropdown: () => void;
}) {
    const setChatScope = (scope: ChatScope) => {
        ChatState.saveChatScope(scope);
        setSendChatScope(scope);
        closeSelectScopeDropdown();
        updatePlaceHolder();
    };

    return (
        <div className={styles['chat-select-scope']}>
            <p
                className={`${styles['scope-text']} ${chatPanelStyles['local']}`}
                onClick={() => setChatScope(ChatState.Scopes.LOCAL.value)}
            >
                {getTextDef('Chat scope: Local')}
            </p>
            <p
                className={`${styles['scope-text']} ${chatPanelStyles['global']}`}
                onClick={() => setChatScope(ChatState.Scopes.GLOBAL.value)}
            >
                {getTextDef('Chat scope: Global')}
            </p>
            <p
                className={`${styles['scope-text']} ${chatPanelStyles['trade']}`}
                onClick={() => setChatScope(ChatState.Scopes.TRADE.value)}
            >
                {getTextDef('Chat scope: Trade')}
            </p>
        </div>
    );
}

export default ChatSelectScope;
