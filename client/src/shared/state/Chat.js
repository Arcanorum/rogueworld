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
                cooldownDate: new Date("1970"),
            },
            GLOBAL: {
                value: "GLOBAL",
                cooldownDate: new Date("1970"),
            },
            TRADE: {
                value: "TRADE",
                cooldownDate: new Date("1970"),
            },
        };
        this.chatScope = this.CHAT_SCOPES.LOCAL.value;
    }

    send(scope, message) {
        this.applicationState.connection.sendEvent("chat", { scope, message });
    }

    validateScope(scope) {
        const index = Object.values(this.CHAT_SCOPES)
            .findIndex((chatScope) => chatScope.value === scope);
        if (index < 0) throw new Error(`Server returned an unknown scope: ${scope}`);
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
            Object.values(this.CHAT_SCOPES)
                .find((chatScope) => chatScope.value === data.scope)
                .cooldownDate = new Date(data.nextAvailableDate);
        }

        PubSub.publish(NEW_CHAT, {
            chats: this.chats,
        });
    }

    getCoolDownDate(scope) {
        const { cooldownDate } = Object.values(this.CHAT_SCOPES)
            .find((chatScope) => chatScope.value === scope);

        if (cooldownDate === undefined) throw new Error(`Unknown scope: ${scope}`);

        return cooldownDate;
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
