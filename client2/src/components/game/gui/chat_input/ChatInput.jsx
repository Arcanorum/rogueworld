import React, { useEffect, useState } from "react";
import "./ChatInput.scss";
import PubSub from "pubsub-js";
import { CHAT_CLOSE, CHAT_OPEN, ENTER_KEY } from "../../../../shared/EventTypes";
import { ApplicationState, PlayerState } from "../../../../shared/state/States";

function ChatInput() {
    const [chatStatus, setChatStatus] = useState(CHAT_CLOSE);
    const [chatMsg, setChatMsg] = useState("");

    const clearChatMsg = () => {
        setChatMsg("");
    };

    const sendChatMsg = (msg) => {
        ApplicationState.connection.sendEvent("chat", msg);
    };

    const hideChatInput = () => {
        PubSub.publish(CHAT_CLOSE, null);
        setChatStatus(CHAT_CLOSE);
    };

    const showChatInput = () => {
        PubSub.publish(CHAT_OPEN, null);
        setChatStatus(CHAT_OPEN);
    };

    useEffect(() => {
        const subs = [
            // hitPoints is undefined for now, until player is implemented again
            PubSub.subscribe(ENTER_KEY, () => {
                // Close the box. Can't chat while dead.
                if (PlayerState.hitPoints <= 0) {
                    clearChatMsg();
                    hideChatInput();
                }
                // Check if the chat input box is open.
                else if (chatStatus === CHAT_OPEN) {
                    // Close the box, and submit the message.
                    hideChatInput();

                    // Don't bother sending empty messages.
                    if (chatMsg !== "") {
                        // Send the message to the server.
                        sendChatMsg(chatMsg);

                        // Empty the contents ready for the next chat.
                        setChatMsg("");
                    }
                }
                // Not open, so open it.
                else {
                    showChatInput();
                }
            }),
        ];

        // Cleanup.
        return () => {
            subs.forEach((sub) => {
                PubSub.unsubscribe(sub);
            });
        };
    }, [chatStatus, chatMsg]);

    // Can't handle e.key === "Enter" for some reason
    // So we rely on PubSub for "Enter" key event for now
    const handleKeyDown = (e) => {
        setChatMsg(e.target.value);
    };

    return (
        <div>
            {chatStatus === CHAT_OPEN && (
            <input
              id="chat-input"
              type="text"
              minLength="1"
              maxLength="46"
              placeholder="Enter a message"
              autoFocus
              autoComplete="off"
              onChange={handleKeyDown}
            />
            )}
        </div>
    );
}

export default ChatInput;
