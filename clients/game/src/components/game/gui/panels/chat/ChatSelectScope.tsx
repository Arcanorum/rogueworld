import { ChatState } from '../../../../../shared/state';
import './ChatSelectScope.scss';
import getTextDef from '../../../../../shared/GetTextDef';
import { ChatScope } from '../../../../../shared/state/Chat';

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
        <div className="chat-select-scope">
            <p
                className="scope-text local"
                onClick={() => setChatScope(ChatState.Scopes.LOCAL.value)}
            >
                {getTextDef('Chat scope: Local')}
            </p>
            <p
                className="scope-text global"
                onClick={() => setChatScope(ChatState.Scopes.GLOBAL.value)}
            >
                {getTextDef('Chat scope: Global')}
            </p>
            <p
                className="scope-text trade"
                onClick={() => setChatScope(ChatState.Scopes.TRADE.value)}
            >
                {getTextDef('Chat scope: Trade')}
            </p>
        </div>
    );
}

export default ChatSelectScope;
