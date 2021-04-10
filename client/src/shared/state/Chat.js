import PubSub from "pubsub-js";
import dungeonz from "../Global";
import { NEW_CHAT_MESSAGE } from "../EventTypes";

class Chat {
    // make sure to modify server/src/WebSocketEvents::eventResponses.chat too
    CHAT_SCOPES = {
        LOCAL: "LOCAL",
        GLOBAL: "GLOBAL",
        TRADE: "TRADE",
    };

    /**
     * @param {Application} applicationState
     */
    constructor(applicationState) {
        this.init();
        this.applicationState = applicationState;
    }

    init() {
        this.messages = [];
    }

    send(scope, message) {
        this.applicationState.connection.sendEvent("chat", { scope, message });
    }

    addNewChat(data) {
        dungeonz.gameScene.chat(data.id, data.message);
        PubSub.publish(NEW_CHAT_MESSAGE, data);
    }
}

export default Chat;
