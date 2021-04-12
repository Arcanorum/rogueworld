import React from "react";
import PropTypes from "prop-types";
import "./ChatTabs.scss";
import { ChatState } from "../../../../../shared/state/States";
import Utils from "../../../../../shared/Utils";

function ChatTabs({
    updatePlaceHolder,
    setViewChatScope,
    setSendChatScope,
    focusOnChatInput,
    scrollChatToBottom,
    viewChatScope,
    getScopeColor,
}) {
    const isActiveTab = (scope) => (viewChatScope === scope ? "active" : "");

    const handleChatTabClick = (scope) => {
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

    const formatChatScope = (scope) => {
        const lowerCasedScope = scope.toLowerCase();
        return lowerCasedScope[0].toUpperCase() + lowerCasedScope.slice(1);
    };

    return (
        <div className="chat-tabs-container">
            <p
              onClick={(e) => handleChatTabClick(ChatState.generalChatScope)}
              className={`chat-tab all ${isActiveTab(ChatState.generalChatScope)}`}
            >
                {Utils.getTextDef("Chat scope: All")}
            </p>
            { Object.values(ChatState.CHAT_SCOPES).map((chatScope) => (
                <p
                  key={chatScope.value}
                  onClick={(e) => handleChatTabClick(chatScope.value)}
                  className={`chat-tab ${getScopeColor(chatScope.value)} ${isActiveTab(chatScope.value)}`}
                >
                    {Utils.getTextDef(`Chat scope: ${formatChatScope(chatScope.value)}`)}
                </p>
            ))}
        </div>
    );
}

ChatTabs.propTypes = {
    viewChatScope: PropTypes.string.isRequired,
    updatePlaceHolder: PropTypes.func.isRequired,
    getScopeColor: PropTypes.func.isRequired,
    setViewChatScope: PropTypes.func.isRequired,
    setSendChatScope: PropTypes.func.isRequired,
    focusOnChatInput: PropTypes.func.isRequired,
    scrollChatToBottom: PropTypes.func.isRequired,
};

export default ChatTabs;
