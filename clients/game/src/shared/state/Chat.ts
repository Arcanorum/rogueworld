import PubSub from 'pubsub-js';
import { v4 as uuidv4 } from 'uuid';
import Global from '../Global';
import { NEW_CHAT } from '../EventTypes';
import { censorString } from '@dungeonz/utils';
import BadWords from '@dungeonz/utils/src/BadWords.yaml';

export type ChatScope = 'ALL' | 'LOCAL' | 'GLOBAL' | 'TRADE';

export interface ChatMessage {
    id: string;
    displayName: string;
    message: string;
    scope: ChatScope;
    discreet: boolean;
    nextAvailableDate: number;
}

interface ChatScopes {
    [key: string]: {
        value: ChatScope;
        cooldownDate: number;
    };
}

class Chat {
    Scopes!: ChatScopes;

    generalChatScope: ChatScope = 'ALL';

    /** Max number of chats that a player can scroll back through. */
    LIMIT = 500;

    chats!: Array<ChatMessage>;

    /** A temp saved unsent chat it can be rendered again. */
    pendingChat!: string;

    /** The last selected chat tab. */
    tabScope!: ChatScope;

    /** The last selected chat scope. */
    chatScope!: ChatScope;

    newChatNotification!: boolean;

    constructor() {
        this.init();
    }

    init() {
        this.Scopes = {
            LOCAL: {
                value: 'LOCAL',
                cooldownDate: Date.now(),
            },
            GLOBAL: {
                value: 'GLOBAL',
                cooldownDate: Date.now(),
            },
            TRADE: {
                value: 'TRADE',
                cooldownDate: Date.now(),
            },
        };
        this.chats = [];
        this.pendingChat = '';
        this.tabScope = this.generalChatScope;
        this.chatScope = this.Scopes.LOCAL.value;
        this.newChatNotification = false;
    }

    send(scope: ChatScope, message: string) {
        Global.states.ApplicationState.connection?.sendEvent('chat', { scope, message });
    }

    validateScope(scope: ChatScope) {
        const result = this.Scopes[scope];
        if (result === undefined) throw new Error(`Server returned an unknown scope: ${scope}`);
    }

    isAlphaNumericSpace(str: string) {
        return str.match('^[\\w\\s]+$');
    }

    filterProfanity(message: string) {
        // Filter profanity only if it is enabled in the settings
        if (Global.states.GUIState.profanityFilterEnabled) {
            // Check if message contains letters or numbers to avoid error
            if (this.isAlphaNumericSpace(message)) {
                return censorString(BadWords, message);
            }
        }

        return message;
    }

    addNewChat(data: ChatMessage) {
        this.validateScope(data.scope);

        // Don't filter profanity of current player's chat, so they can't see what might have been censored for other players.
        // Makes offenders less likely to try and get around the filter if they think it wasn't censored at all.
        if (data.id !== Global.states.PlayerState.entityId) {
            data.message = this.filterProfanity(data.message);
            this.newChatNotification = true;
        }

        // Some chat messages shouldn't show the overhead text (i.e. chat command responses).
        if (!data.discreet) {
            Global.gameScene.chat(data.id, data.message);
        }

        const newChat = { ...data, id: uuidv4() }; // add unique id for react keys

        this.chats = [ ...this.chats, newChat ];

        if (this.chats.length > this.LIMIT) {
            this.chats.shift();
        }

        if (data.id === Global.states.PlayerState.entityId) {
            this.Scopes[data.scope].cooldownDate = data.nextAvailableDate;
            this.newChatNotification = false;
        }

        PubSub.publish(NEW_CHAT, {
            chats: this.chats,
            newChatNotification: this.newChatNotification,
        });
    }

    getCoolDownDate(scope: ChatScope) {
        this.validateScope(scope);
        return this.Scopes[scope].cooldownDate;
    }

    setPendingChat(message: string) {
        this.pendingChat = message;
    }

    // Accepts ALL, LOCAL, GLOBAL, TRADE
    saveTabScope(scope: ChatScope) {
        this.tabScope = scope;
    }

    // Accepts LOCAL, GLOBAL, TRADE
    saveChatScope(scope: ChatScope) {
        this.chatScope = scope;
    }
}

export default Chat;
