import React from "react";
import PropTypes from "prop-types";
import "./ChatTabs.scss";
import { ChatState } from "../../../../../shared/state/States";

function ChatTabs({
    updatePlaceHolder,
    setViewChatScope,
    setSendChatScope,
    focusOnChatInput,
    scrollChatToBottom,
    viewChatScope,
    getScopeColor,
}) {
    const isActiveTab = (_scope) => (viewChatScope === _scope ? "active" : "");

    const handleChatTabClick = (_scope) => {
        // don't set sendChat scope if player selected to view "ALL" tab
        if (_scope !== ChatState.generalChatScope) {
            setSendChatScope(_scope);
            ChatState.saveChatScope(_scope);
        }
        ChatState.saveTabScope(_scope);
        setViewChatScope(_scope);
        focusOnChatInput();
        scrollChatToBottom();
        updatePlaceHolder();
    };
    return (
        <div className="chat-tabs-container">
            <p
              onClick={(e) => handleChatTabClick(ChatState.generalChatScope)}
              className={`chat-tab all ${isActiveTab(ChatState.generalChatScope)}`}
            >
                ALL
            </p>
            { Object.values(ChatState.CHAT_SCOPES).map((chatScope) => (
                <p
                  key={chatScope.value}
                  onClick={(e) => handleChatTabClick(chatScope.value)}
                  className={`chat-tab ${getScopeColor(chatScope.value)} ${isActiveTab(chatScope.value)}`}
                >
                    {chatScope.value}
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
