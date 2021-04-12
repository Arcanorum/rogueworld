import React from "react";
import PropTypes from "prop-types";
import Utils from "../../../../../shared/Utils";
import { ChatState } from "../../../../../shared/state/States";
import "./ChatSelectScope.scss";

function ChatSelectScope({ updatePlaceHolder, setSendChatScope, closeSelectScopeDropdown }) {
    const setChatScope = (scope) => {
        ChatState.saveChatScope(scope);
        setSendChatScope(scope);
        closeSelectScopeDropdown();
        updatePlaceHolder();
    };

    return (
        <div className="chat-select-scope">
            <p
              className="scope-text local"
              onClick={() => setChatScope(ChatState.CHAT_SCOPES.LOCAL.value)}
            >
                {Utils.getTextDef("Chat scope: Local")}
            </p>
            <p
              className="scope-text global"
              onClick={() => setChatScope(ChatState.CHAT_SCOPES.GLOBAL.value)}
            >
                {Utils.getTextDef("Chat scope: Global")}
            </p>
            <p
              className="scope-text trade"
              onClick={() => setChatScope(ChatState.CHAT_SCOPES.TRADE.value)}
            >
                {Utils.getTextDef("Chat scope: Trade")}
            </p>
        </div>
    );
}

ChatSelectScope.propTypes = {
    updatePlaceHolder: PropTypes.func.isRequired,
    setSendChatScope: PropTypes.func.isRequired,
    closeSelectScopeDropdown: PropTypes.func.isRequired,
};

export default ChatSelectScope;
