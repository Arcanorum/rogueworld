import PubSub from "pubsub-js";
import { v4 as uuidv4 } from "uuid";
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

    /**
     * @param {Application} applicationState
     * @param {Player} playerState
     */
    constructor(applicationState, playerState) {
        this.init();
        this.applicationState = applicationState;
        this.playerState = playerState;
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
    }

    send(scope, message) {
        this.applicationState.connection.sendEvent("chat", { scope, message });
    }

    validateScope(scope) {
        const result = this.CHAT_SCOPES[scope];
        if (result === undefined) throw new Error(`Server returned an unknown scope: ${scope}`);
    }

    addNewChat(data) {
        this.validateScope(data.scope);
        dungeonz.gameScene.chat(data.id, data.message);
        const newChat = { ...data, id: uuidv4() }; // add unique id for react keys

        this.chats = [...this.chats, newChat];

        if (this.chats.length > this.LIMIT) {
            this.chats.shift();
        }

        if (data.id === this.playerState.entityID) {
            this.CHAT_SCOPES[data.scope].cooldownDate = data.nextAvailableDate;
        }

        PubSub.publish(NEW_CHAT, {
            chats: this.chats,
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
