import React from "react";
import PropTypes from "prop-types";
import { ChatState } from "../../../../../shared/state/States";
import "./ChatSelectScope.scss";

function ChatSelectScope({ setCurrentChatScope, closeShowSelectScope }) {
    return (
        <div className="chat-select-scope">
            <p
              className="scope-text local"
              onClick={() => {
                  setCurrentChatScope(ChatState.CHAT_SCOPES.LOCAL);
                  closeShowSelectScope();
              }}
            >
                Local
            </p>
            <p
              className="scope-text global"
              onClick={() => {
                  setCurrentChatScope(ChatState.CHAT_SCOPES.GLOBAL);
                  closeShowSelectScope();
              }}
            >
                Global
            </p>
            <p
              className="scope-text trade"
              onClick={() => {
                  setCurrentChatScope(ChatState.CHAT_SCOPES.TRADE);
                  closeShowSelectScope();
              }}
            >
                Trade
            </p>
        </div>
    );
}

ChatSelectScope.propTypes = {
    setCurrentChatScope: PropTypes.func.isRequired,
    closeShowSelectScope: PropTypes.func.isRequired,
};

export default ChatSelectScope;
