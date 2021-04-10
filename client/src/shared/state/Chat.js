import PubSub from "pubsub-js";
import { v4 as uuidv4 } from "uuid";
import dungeonz from "../Global";
import { NEW_CHAT } from "../EventTypes";

class Chat {
    // make sure to modify server/src/WebSocketEvents::eventResponses.chat too
    CHAT_SCOPES = {
        LOCAL: "LOCAL",
        GLOBAL: "GLOBAL",
        TRADE: "TRADE",
    };

    // chat limit
    LIMIT = 500;

    /**
     * @param {Application} applicationState
     */
    constructor(applicationState) {
        this.init();
        this.applicationState = applicationState;
    }

    init() {
        this.chats = [];
    }

    send(scope, message) {
        this.applicationState.connection.sendEvent("chat", { scope, message });
    }

    addNewChat(data) {
        dungeonz.gameScene.chat(data.id, data.message);
        const newData = { ...data, id: uuidv4() }; // add unique id for react keys

        this.chats = [...this.chats, newData];

        if (this.chats.length > this.LIMIT) {
            this.chats.shift();
        }

        PubSub.publish(NEW_CHAT, this.chats);
    }
}

export default Chat;
