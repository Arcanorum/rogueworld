import React from "react";
import PropTypes from "prop-types";
import { ChatState } from "../../../../../shared/state/States";
import "./ChatSelectScope.scss";

function ChatSelectScope({ setSendChatScope, closeSelectScopeDropdown }) {
    return (
        <div className="chat-select-scope">
            <p
              className="scope-text local"
              onClick={() => {
                  setSendChatScope(ChatState.CHAT_SCOPES.LOCAL);
                  closeSelectScopeDropdown();
              }}
            >
                Local
            </p>
            <p
              className="scope-text global"
              onClick={() => {
                  setSendChatScope(ChatState.CHAT_SCOPES.GLOBAL);
                  closeSelectScopeDropdown();
              }}
            >
                Global
            </p>
            <p
              className="scope-text trade"
              onClick={() => {
                  setSendChatScope(ChatState.CHAT_SCOPES.TRADE);
                  closeSelectScopeDropdown();
              }}
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
