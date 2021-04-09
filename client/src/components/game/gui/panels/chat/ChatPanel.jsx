import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import "./ChatPanel.scss";
import PubSub from "pubsub-js";
import { ApplicationState, GUIState, PlayerState } from "../../../../../shared/state/States";
import { PANEL_CHANGE } from "../../../../../shared/EventTypes";
import Panels from "../PanelsEnum";

function ChatPanel({ onCloseCallback }) {
    const [chats, sendChat] = useState([]);
    const chatContentsRef = useRef(null);
    const chatInputRef = useRef(null);

    useEffect(() => {
        const subs = [
            PubSub.subscribe(PANEL_CHANGE, () => {
                console.log("panel change from chats");
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

    const sendC = (e) => {
        if (e.key === "Enter") {
            const text = e.target.value;
            if (!text) return;

            const newChat = `${PlayerState.displayName}: ${text}`;
            sendChat((prevChats) => [...prevChats, newChat]);

            ApplicationState.connection.sendEvent("chat", text);

            e.target.value = "";

            // add some delay to properly scroll down to edge of chats
            setTimeout(scrollChatToBottom, 10);
        }
    };

    return (
        <div className="chat-container gui-zoomable">
            <div className="chat-contents" ref={chatContentsRef}>
                { chats.map((chat) => (<p className="chat-text" key={chat + Math.random() * 100000}>{chat}</p>)) }
            </div>
            <div className="chat-box-container">
                <p className="player-name">{ `${PlayerState.displayName}:` }</p>
                <input type="text" className="chat-box-input" autoFocus autoComplete="off" onKeyDown={sendC} ref={chatInputRef} />
            </div>
        </div>
    );
}

ChatPanel.propTypes = {
    onCloseCallback: PropTypes.func.isRequired,
};

export default ChatPanel;
