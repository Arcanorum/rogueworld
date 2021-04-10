// import PubSub from "pubsub-js";
// import Utils from "../Utils";

class Chat {
    constructor() {
        this.init();
        this.CHAT_SCOPES = {
            LOCAL: "LOCAL",
            GLOBAL: "GLOBAL",
            TRADE: "TRADE",
        };
    }

    init() {
        this.chats = [];
    }

    addChat(chat) {
        this.chats = [...this.chats, chat];

        // PubSub.publish(MODIFY_BANK_WEIGHT, { new: value });
    }
}

export default Chat;
