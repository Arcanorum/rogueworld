import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import "./ChatPanel.scss";
import PubSub from "pubsub-js";
import {
    GUIState, PlayerState, ChatState,
} from "../../../../../shared/state/States";
import { NEW_CHAT, PANEL_CHANGE, SHOULD_SCROLL_CHAT } from "../../../../../shared/EventTypes";
import Panels from "../PanelsEnum";
import ChatLine from "./ChatLine";
import ChatSelectScope from "./ChatSelectScope";

function ChatPanel({ onCloseCallback }) {
    const [chats, setChats] = useState(ChatState.chats);
    const [sendChatScope, setSendChatScope] = useState(ChatState.CHAT_SCOPES.LOCAL);
    const [showSelectScopeDropdown, setShowSelectScopeDropdown] = useState(false);
    const chatContentsRef = useRef(null);
    const chatInputRef = useRef(null);
    let autoScroll = true;

    // auto scroll only if user is not scrolling upwards
    // if user is scrolling upwards it usually means the that user is back reading (auto-scroll = on)
    // if user scroll all the way down that means the user is done back reading (auto-scroll = off)
    const registerChatScrollWatcher = () => {
        let isSent = true;
        let pendingPublish;

        // throttle this so we don't blow up PubSub when user scrolls
        // no need to remove eventListener as it is automatically removed
        chatContentsRef.current.addEventListener("scroll", (e) => {
            if (isSent === false) clearTimeout(pendingPublish);
            const {
                scrollHeight,
                scrollTop,
                clientHeight,
            } = e.target;

            isSent = false;
            pendingPublish = setTimeout(() => {
                PubSub.publish(SHOULD_SCROLL_CHAT, scrollHeight - scrollTop === clientHeight);
                isSent = true;
            }, 300);
        });
    };

    const scrollChatToBottom = () => {
        if (!autoScroll) return;
        // add some delay to properly scroll down to edge of chats
        setTimeout(() => {
            chatContentsRef.current.scrollTop = chatContentsRef.current.scrollHeight;
        }, 10);
    };

    useEffect(() => {
        const subs = [
            PubSub.subscribe(PANEL_CHANGE, () => {
                if (GUIState.activePanel === Panels.Chat) {
                    chatInputRef.current.focus();
                }
            }),
            PubSub.subscribe(NEW_CHAT, (msg, data) => {
                setChats(data);
                scrollChatToBottom();
            }),
            PubSub.subscribe(SHOULD_SCROLL_CHAT, (msg, data) => {
                autoScroll = data;
            }),
        ];

        scrollChatToBottom();

        registerChatScrollWatcher();

        return () => {
            subs.forEach((sub) => {
                PubSub.unsubscribe(sub);
            });
        };
    }, []);

    const sendChat = (e) => {
        ChatState.setPendingChat(e.target.value); // not sure if this needs throttling

        if (e.key === "Enter") {
            const message = e.target.value;
            if (!message) return;

            ChatState.send(sendChatScope, message);

            e.target.value = "";
            ChatState.setPendingChat("");
        }
    };

    const toggleSelectScopeDropdown = () => {
        setShowSelectScopeDropdown((prevVal) => !prevVal);
    };

    const closeSelectScopeDropdown = () => {
        setShowSelectScopeDropdown(false);
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
            <div className="chat-contents" ref={chatContentsRef} onClick={closeSelectScopeDropdown}>
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
                <p className={`player-name ${getScopeColor(sendChatScope)}`} onClick={toggleSelectScopeDropdown}>{ `${PlayerState.displayName}:` }</p>
                <input type="text" className="chat-box-input" onKeyDown={sendChat} ref={chatInputRef} defaultValue={ChatState.pendingChat} maxLength={255} autoFocus autoComplete="off" />
            </div>
            { showSelectScopeDropdown && (
            <ChatSelectScope
              setSendChatScope={setSendChatScope}
              closeSelectScopeDropdown={closeSelectScopeDropdown}
            />
            ) }
        </div>
    );
}

ChatPanel.propTypes = {
    onCloseCallback: PropTypes.func.isRequired,
};

export default ChatPanel;
