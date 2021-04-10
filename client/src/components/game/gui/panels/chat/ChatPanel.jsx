import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import "./ChatPanel.scss";
import PubSub from "pubsub-js";
import {
    ApplicationState, GUIState, PlayerState, ChatState,
} from "../../../../../shared/state/States";
import { PANEL_CHANGE } from "../../../../../shared/EventTypes";
import Panels from "../PanelsEnum";
import ChatLine from "./ChatLine";
import ChatSelectScope from "./ChatSelectScope";

let tmpId = 0;

function ChatPanel({ onCloseCallback }) {
    const [chats, appendToChat] = useState([]);
    const [currentChatScope, setCurrentChatScope] = useState(ChatState.CHAT_SCOPES.LOCAL);
    const [showSelectScope, setShowSelectScope] = useState(false);
    const chatContentsRef = useRef(null);
    const chatInputRef = useRef(null);

    useEffect(() => {
        const subs = [
            PubSub.subscribe(PANEL_CHANGE, () => {
                if (GUIState.activePanel === Panels.Chat) {
                    chatInputRef.current.focus();
                }
            }),
        ];

        return () => {
            subs.forEach((sub) => {
                PubSub.unsubscribe(sub);
            });
        };
    });

    const scrollChatToBottom = () => {
        chatContentsRef.current.scrollTop = chatContentsRef.current.scrollHeight;
    };

    const sendChat = (e) => {
        if (e.key === "Enter") {
            const message = e.target.value;
            if (!message) return;

            tmpId += 1;
            const newChat = {
                id: tmpId,
                scope: currentChatScope,
                displayName: PlayerState.displayName,
                message,
            };
            appendToChat((prevChats) => [...prevChats, newChat]);

            ApplicationState.connection.sendEvent("chat", { scope: currentChatScope, message });

            e.target.value = "";

            // add some delay to properly scroll down to edge of chats
            setTimeout(scrollChatToBottom, 10);
        }
    };

    const toggleShowSelectScope = () => {
        setShowSelectScope((prevVal) => !prevVal);
    };

    const closeShowSelectScope = () => {
        setShowSelectScope(false);
    };

    const getScopeColor = (_scope) => {
        // return css class based on current scope
        if (_scope === ChatState.CHAT_SCOPES.LOCAL) return "local";
        if (_scope === ChatState.CHAT_SCOPES.GLOBAL) return "global";
        if (_scope === ChatState.CHAT_SCOPES.TRADE) return "trade";

        throw Error("Chat scope not found");
    };

    return (
        <div className="chat-container gui-zoomable">
            <div className="chat-tabs-container">
                { Object.values(ChatState.CHAT_SCOPES).map((_scope) => (
                    <p key={_scope} className={`chat-tab ${getScopeColor(_scope)}`}>{_scope}</p>))}
            </div>
            <div className="chat-contents" ref={chatContentsRef} onClick={closeShowSelectScope}>
                { chats.map((chat) => (
                    <ChatLine
                      key={chat.id}
                      scope={chat.scope}
                      displayName={chat.displayName}
                      message={chat.message}
                      getScopeColor={getScopeColor}
                    />
                )) }
            </div>
            <div className="chat-box-container">
                <p className={`player-name ${getScopeColor(currentChatScope)}`} onClick={toggleShowSelectScope}>{ `${PlayerState.displayName}:` }</p>
                <input type="text" className="chat-box-input" autoFocus autoComplete="off" onKeyDown={sendChat} ref={chatInputRef} />
            </div>
            { showSelectScope && (
            <ChatSelectScope
              setCurrentChatScope={setCurrentChatScope}
              closeShowSelectScope={closeShowSelectScope}
            />
            ) }
        </div>
    );
}

ChatPanel.propTypes = {
    onCloseCallback: PropTypes.func.isRequired,
};

export default ChatPanel;
