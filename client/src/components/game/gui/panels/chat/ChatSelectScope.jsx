import React from "react";
import PropTypes from "prop-types";
import { ChatState } from "../../../../../shared/state/States";
import "./ChatSelectScope.scss";

function ChatSelectScope({ setSendChatScope, closeSelectScopeDropdown }) {
    const setChatScope = (scope) => {
        ChatState.saveChatScope(scope);
        setSendChatScope(scope);
        closeSelectScopeDropdown();
    };

    return (
        <div className="chat-select-scope">
            <p
              className="scope-text local"
              onClick={() => setChatScope(ChatState.CHAT_SCOPES.LOCAL)}
            >
                Local
            </p>
            <p
              className="scope-text global"
              onClick={() => setChatScope(ChatState.CHAT_SCOPES.GLOBAL)}
            >
                Global
            </p>
            <p
              className="scope-text trade"
              onClick={() => setChatScope(ChatState.CHAT_SCOPES.TRADE)}
            >
                Trade
            </p>
        </div>
    );
}

ChatSelectScope.propTypes = {
    setSendChatScope: PropTypes.func.isRequired,
    closeSelectScopeDropdown: PropTypes.func.isRequired,
};

export default ChatSelectScope;
