import PubSub from "pubsub-js";
import { v4 as uuidv4 } from "uuid";
import BadWords from "bad-words";
import dungeonz from "../Global";
import { NEW_CHAT } from "../EventTypes";

class Chat {
    // make sure to modify server/src/WebSocketEvents::eventResponses.chat too
    CHAT_SCOPES;

    generalChatScope = "ALL";

    // max number of chats that player can back-read
    LIMIT = 500;

    // save unsent chat here so we can render them again
    pendingChat;

    // save last selected tab here
    tabScope;

    // save last selected chat scope here
    chatScope;

    // bad-words instance
    badWords;

    /**
     * @param {Application} applicationState
     * @param {Player} playerState
     * @param {GUI} guiState
     */
    constructor(applicationState, playerState, guiState) {
        this.init();
        this.applicationState = applicationState;
        this.playerState = playerState;
        this.guiState = guiState;
    }

    init() {
        this.chats = [];
        this.pendingChat = "";
        this.tabScope = this.generalChatScope;
        this.CHAT_SCOPES = {
            LOCAL: {
                value: "LOCAL",
                cooldownDate: Date.now(),
            },
            GLOBAL: {
                value: "GLOBAL",
                cooldownDate: Date.now(),
            },
            TRADE: {
                value: "TRADE",
                cooldownDate: Date.now(),
            },
        };
        this.chatScope = this.CHAT_SCOPES.LOCAL.value;
        this.badWords = new BadWords();
        this.newChatNotification = false;
    }

    send(scope, message) {
        this.applicationState.connection.sendEvent("chat", { scope, message });
    }

    validateScope(scope) {
        const result = this.CHAT_SCOPES[scope];
        if (result === undefined) throw new Error(`Server returned an unknown scope: ${scope}`);
    }

    isAlphaNumericSpace(str) {
        return str.match("^[\\w\\s]+$");
    }

    filterProfanity(message) {
        // filter profanity only if it is enabled in the settings
        if (this.guiState.profanityFilterEnabled) {
            // check if message contains letters or numbers to avoid error
            // https://github.com/web-mech/badwords/issues/103
            if (this.isAlphaNumericSpace(message)) {
                return this.badWords.clean(message);
            }
        }

        return message;
    }

    addNewChat(data) {
        this.validateScope(data.scope);

        // Don't filter profanity of current player's chat
        if (data.id !== this.playerState.entityID) {
            data.message = this.filterProfanity(data.message);
            this.newChatNotification = true;
        }

        // Some chat messages shouldn't show the overhead text (i.e. chat command responses).
        if (!data.discreet) {
            dungeonz.gameScene.chat(data.id, data.message);
        }

        const newChat = { ...data, id: uuidv4() }; // add unique id for react keys

        this.chats = [...this.chats, newChat];

        if (this.chats.length > this.LIMIT) {
            this.chats.shift();
        }

        if (data.id === this.playerState.entityID) {
            this.CHAT_SCOPES[data.scope].cooldownDate = data.nextAvailableDate;
            this.newChatNotification = false;
        }

        PubSub.publish(NEW_CHAT, {
            chats: this.chats,
            newChatNotification: this.newChatNotification,
        });
    }

    getCoolDownDate(scope) {
        this.validateScope(scope);
        return this.CHAT_SCOPES[scope].cooldownDate;
    }

    setPendingChat(message) {
        this.pendingChat = message;
    }

    // Accepts ALL, LOCAL, GLOBAL, TRADE
    saveTabScope(scope) {
        this.tabScope = scope;
    }

    // Accepts LOCAL, GLOBAL, TRADE
    saveChatScope(scope) {
        this.chatScope = scope;
    }
}

export default Chat;
