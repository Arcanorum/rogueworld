import { useState, useRef, useEffect } from 'react';
import PubSub from 'pubsub-js';
import styles from './ChatPanel.module.scss';
import {
    GUIState, PlayerState, ChatState,
} from '../../../../../shared/state';
import {
    FOCUS_CHAT, NEW_CHAT, SHOULD_SCROLL_CHAT,
} from '../../../../../shared/EventTypes';
import ChatLine from './ChatLine';
import ChatSelectScope from './ChatSelectScope';
import enterChatIcon from '../../../../../assets/images/gui/panels/chat/enter-chat-icon.png';
import ChatTabs from './ChatTabs';
import { ChatScope } from '../../../../../shared/state/Chat';
import getTextDef from '../../../../../shared/GetTextDef';

export const getScopeColor = (scope: ChatScope) => {
    // Return css class based on current scope.
    if (scope === ChatState.Scopes.LOCAL.value) return styles.local;
    if (scope === ChatState.Scopes.GLOBAL.value) return styles.global;
    if (scope === ChatState.Scopes.TRADE.value) return styles.trade;

    throw Error(`Chat scope ${scope} not found`);
};

function ChatPanel() {
    const defaultPlaceHolder = getTextDef('Enter message');
    const [chats, setChats] = useState(ChatState.chats);
    const [viewChatScope, setViewChatScope] = useState(ChatState.tabScope);
    const [sendChatScope, setSendChatScope] = useState(ChatState.chatScope);
    const [placeHolder, setPlaceHolder] = useState(defaultPlaceHolder);
    const [showSelectScopeDropdown, setShowSelectScopeDropdown] = useState(false);
    const chatContentsRef = useRef<HTMLDivElement>(null);
    const chatInputRef = useRef<HTMLInputElement>(null);
    let autoScroll = true;
    let placeHolderInterval: number;

    // Auto scroll only if user is not scrolling upwards.
    // If user is scrolled upwards it usually means that the user is back reading (auto-scroll = on)
    // If user scrolls all the way down that means the user is done back reading (auto-scroll = off)
    const registerChatScrollWatcher = () => {
        let isSent = true;
        let pendingPublish: number;

        // Debounce this so we don't blow up PubSub when user scrolls.
        // No need to remove eventListener as it is automatically removed.
        chatContentsRef.current?.addEventListener('scroll', (e) => {
            if (isSent === false) clearTimeout(pendingPublish);
            const {
                scrollHeight,
                scrollTop,
                clientHeight,
            } = e.target as HTMLElement;

            isSent = false;
            pendingPublish = window.setTimeout(() => {
                PubSub.publish(SHOULD_SCROLL_CHAT, scrollHeight - scrollTop === clientHeight);
                isSent = true;
            }, 300);
        });
    };

    const scrollChatToBottom = () => {
        if (!autoScroll) return;
        // Add some delay to properly scroll down to edge of chats.
        setTimeout(() => {
            if (GUIState.showChatBox) {
                if (!chatContentsRef || !chatContentsRef.current) return;
                chatContentsRef.current.scrollTop = chatContentsRef.current.scrollHeight;
            }
        }, 10);
    };

    const focusOnChatInput = () => chatInputRef.current?.focus();

    const updatePlaceHolder = () => {
        const currentDate = Date.now();
        const targetDate = ChatState.getCoolDownDate(ChatState.chatScope);
        const secondsRemaining = (targetDate - currentDate) / 1000;

        if (secondsRemaining <= 0) setPlaceHolder(defaultPlaceHolder);
        else setPlaceHolder(`${getTextDef('Cooldown')}: ${Math.round(secondsRemaining)}`);
    };

    const refreshPlaceHolder = () => {
        placeHolderInterval = window.setInterval(() => updatePlaceHolder(), 1000);
    };

    useEffect(() => {
        const subs = [
            PubSub.subscribe(FOCUS_CHAT, () => {
                if (document.activeElement === chatInputRef.current) {
                    (document.activeElement as HTMLElement).blur();
                }
                else {
                    focusOnChatInput();
                }
            }),
            PubSub.subscribe(NEW_CHAT, (msg, data) => {
                setChats(data.chats);
                scrollChatToBottom();
            }),
            PubSub.subscribe(SHOULD_SCROLL_CHAT, (msg, data) => {
                autoScroll = data;
            }),
        ];

        scrollChatToBottom();

        registerChatScrollWatcher();

        refreshPlaceHolder();

        return () => {
            subs.forEach((sub) => {
                PubSub.unsubscribe(sub);
            });

            clearInterval(placeHolderInterval);
        };
    }, []);

    const sendChat = () => {
        const message = chatInputRef.current?.value;

        if (!message) return;

        ChatState.send(sendChatScope, message);

        ChatState.setPendingChat('');

        chatInputRef.current.value = '';

        setPlaceHolder(`${getTextDef('Sending')}...`);
    };

    const handleChatInputChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
        ChatState.setPendingChat((e.target as HTMLInputElement).value);

        if (e.key === 'Enter') {
            sendChat();
        }
    };

    const handleChatFocusChange = (e: React.FocusEvent<HTMLInputElement>) => {
        ChatState.setPendingChat((e.target as HTMLInputElement).value);
    };

    const handleSendBtnClick = () => sendChat();

    const toggleSelectScopeDropdown = () => {
        setShowSelectScopeDropdown((prevVal) => !prevVal);
    };

    const closeSelectScopeDropdown = () => {
        setShowSelectScopeDropdown(false);
    };

    const filteredChats = () => {
        let newChats = chats;

        if (viewChatScope !== ChatState.generalChatScope) {
            newChats = newChats.filter((chat) => chat.scope === viewChatScope);
        }

        return newChats.map((chat) => (
            <ChatLine
                key={chat.id}
                scope={chat.scope}
                displayName={chat.displayName}
                content={chat.content}
            />
        ));
    };

    return (
        <div className={styles['chat-container']}>
            <ChatTabs
                updatePlaceHolder={updatePlaceHolder}
                setViewChatScope={setViewChatScope}
                setSendChatScope={setSendChatScope}
                focusOnChatInput={focusOnChatInput}
                scrollChatToBottom={scrollChatToBottom}
                viewChatScope={viewChatScope}
            />
            <div className={styles['chat-contents-wrapper']}>
                <div className={styles['chat-contents']} ref={chatContentsRef} onClick={closeSelectScopeDropdown}>
                    {filteredChats()}
                </div>
            </div>
            <div className={styles['chat-input-container']}>
                <p
                    className={`${styles['player-name']} ${getScopeColor(sendChatScope)}`}
                    onClick={toggleSelectScopeDropdown}
                >
                    <span className={styles.arrow}>{`${showSelectScopeDropdown ? '⬇' : '⬆'}`}</span>
                    <span className={styles['scope-label']}>{`(${sendChatScope})`}</span>
                    { `${PlayerState.displayName}:` }
                </p>
                <input
                    type="text"
                    className={`${styles['chat-input']} ${placeHolder !== defaultPlaceHolder ? styles.disabled : ''} ${getScopeColor(sendChatScope)}`}
                    placeholder={placeHolder}
                    onKeyDown={handleChatInputChange}
                    onBlur={handleChatFocusChange}
                    ref={chatInputRef}
                    defaultValue={ChatState.pendingChat}
                    maxLength={255}
                    autoFocus
                    autoComplete="off"
                    readOnly={placeHolder !== defaultPlaceHolder}
                />
                <button type="button" className={styles['send-btn']} onClick={handleSendBtnClick}>
                    <img className={styles['send-btn-icon']} src={enterChatIcon.src} alt="send" />
                </button>
            </div>
            { showSelectScopeDropdown && (
                <ChatSelectScope
                    updatePlaceHolder={updatePlaceHolder}
                    setSendChatScope={setSendChatScope}
                    closeSelectScopeDropdown={closeSelectScopeDropdown}
                />
            ) }
        </div>
    );
}

export default ChatPanel;
