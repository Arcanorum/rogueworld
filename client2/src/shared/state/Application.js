import PubSub from "pubsub-js";
import {
    CONNECTING, CONNECTED, JOINING, JOINED, LOADING, LOAD_ACCEPTED, WEBSOCKET_CLOSE,
} from "../EventTypes";

class Application {
    connecting = false;

    connected = false;

    joining = false;

    joined = false;

    loading = false;

    loadAccepted = true;

    constructor() {
        PubSub.subscribe(WEBSOCKET_CLOSE, () => {
            this.setConnected(false);
            this.setConnecting(false);
            this.setJoined(false);
        });
    }

    setConnecting(value) {
        const old = this.connecting;
        this.connecting = value;
        PubSub.publish(CONNECTING, { old, new: value });
    }

    setConnected(value) {
        const old = this.connected;
        this.connected = value;
        PubSub.publish(CONNECTED, { old, new: value });

        if (value) {
            this.setConnecting(false);
        }
    }

    setJoining(value) {
        const old = this.joining;
        this.joining = value;
        PubSub.publish(JOINING, { old, new: value });
    }

    setJoined(value) {
        const old = this.joined;
        this.joined = value;
        PubSub.publish(JOINED, { old, new: value });

        if (value) {
            this.setJoining(false);
        }
    }

    setLoading(value) {
        const old = this.joined;
        this.loading = value;
        PubSub.publish(LOADING, { old, new: value });

        // When loading again, make sure the loading page gets shown.
        if (value) {
            this.setLoadAccepted(false);
        }
    }

    setLoadAccepted(value) {
        const old = this.loadAccepted;
        this.loadAccepted = value;
        PubSub.publish(LOAD_ACCEPTED, { old, new: value });
    }
}

export default Application;
