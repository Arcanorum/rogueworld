import PubSub from "pubsub-js";
import EventNames from "../catalogues/EventNames.json";
import eventResponses from "./websocket_events/EventResponses";
import { ApplicationState } from "../shared/state/States";
import { WEBSOCKET_CLOSE, WEBSOCKET_ERROR } from "../shared/EventTypes";
import Utils from "../shared/Utils";

let serverURL = "";

export const ConnectionCloseTypes = {
    // No connection made yet. User has no internet access.
    CANNOT_CONNECT_NO_INTERNET: Symbol("CANNOT_CONNECT_NO_INTERNET"),
    // No connection made yet. Connection can't be made to server.
    CANNOT_CONNECT_NO_SERVER: Symbol("CANNOT_CONNECT_NO_SERVER"),
    // Already connected. User lost internet access.
    DISCONNECTED_NO_INTERNET: Symbol("DISCONNECTED_NO_INTERNET"),
    // Already connected. Server crashed or something.
    DISCONNECTED_NO_SERVER: Symbol("DISCONNECTED_NO_SERVER"),
};

const getErrorCategory = () => {
    if (ApplicationState.connected) {
        if (window.navigator.onLine) {
            // Something happened to the connection, probably server related.
            return ConnectionCloseTypes.DISCONNECTED_NO_SERVER;
        }

        // Lost internet connection.
        return ConnectionCloseTypes.DISCONNECTED_NO_INTERNET;
    }

    // Not connected yet.
    if (window.navigator.onLine) {
        // Something wrong creating the connection, probably server related.
        return ConnectionCloseTypes.CANNOT_CONNECT_NO_SERVER;
    }

    // No internet connection.
    return ConnectionCloseTypes.CANNOT_CONNECT_NO_INTERNET;
};

/**
 * Attempt to create a new websocket connection to the game server.
 * @returns {Boolean} Whether a the function finished without a problem.
 */
export const connectToGameServer = () => {
    // If the game is running in dev mode (localhost), connect without SSL.
    if (window.host === "local") {
        serverURL = "ws://127.0.0.4:4567";
    } else if (window.host === "test") {
        serverURL = "wss://test.dungeonz.io:443";
    } else {
        // Deployment mode. Connect to live server, which should be using SSL.
        serverURL = "wss://dungeonz.io:443";
    }

    if (ApplicationState.connected || ApplicationState.connecting) {
        return false;
    }

    console.log("existing ws connection?", window.ws);

    // Connect to the game server.
    window.ws = new WebSocket(serverURL);

    ApplicationState.setConnecting(true);

    /**
     * Event emit helper. Attach this to a socket, and use it to send an event to the server.
     * @param {String} eventName
     * @param {Object} [data]
     */
    window.ws.sendEvent = (eventName, data) => {
        window.ws.send(JSON.stringify({ eventName, data }));
    };

    // Wait for the connection to have finished opening before attempting to join the world.
    window.ws.onopen = () => {
        ApplicationState.setConnected(true);
    };

    window.ws.onmessage = (event) => {
        // The data is JSON, so parse it.
        const parsedMessage = JSON.parse(event.data);
        // Every event received should have an event name ID, which is a number that represents an event name string.
        // Numbers are smaller, so saves sending lengthy strings for each message.
        const { eventNameID } = parsedMessage;
        // Look up the corresponding event name string for the given ID.
        const eventName = EventNames[eventNameID];
        // Check this event name ID is in the list of valid event name IDs.
        if (eventName !== undefined) {
            // Check there is a response function to run for the event.
            if (eventResponses[eventName] !== undefined) {
                // Run the response, giving it any data.
                // Need to check for if any data was given at all, otherwise falsy values
                // like 0 and false would be ignored, even though they are valid values.
                if (parsedMessage.data === undefined) {
                    eventResponses[eventName]({});
                } else {
                    eventResponses[eventName](parsedMessage.data);
                }
            }
        }
    };

    window.ws.onclose = () => {
        Utils.message("Disconnected from game server.");

        window.ws = false;

        // Do this first, otherwise the current state is lost and can't tell if it
        // was initial connection failure, or failure while already connected.
        PubSub.publish(WEBSOCKET_CLOSE, getErrorCategory());

        ApplicationState.setJoined(false);
        ApplicationState.setJoining(false);
        ApplicationState.setConnected(false);
        ApplicationState.setConnecting(false);
    };

    window.ws.onerror = (error) => {
        Utils.message("Websocket error:", error);

        PubSub.publish(WEBSOCKET_ERROR, error);
    };

    return true;
};

export const joinGameNewCharacter = (characterName) => {
    window.ws.sendEvent("new_char", { displayName: characterName });

    ApplicationState.setJoining(true);
};

export const joinGameContinue = async (username, password) => {
    // Check username and password are valid.
    if (username === "") return;
    if (password === "") return;

    // Encrypt the password before sending.
    const hash = await Utils.digestMessage(password);

    window.ws.sendEvent("log_in", {
        username,
        password: hash,
    });

    ApplicationState.setJoining(true);
};
