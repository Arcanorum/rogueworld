import { digestMessage, message } from '@dungeonz/utils';
import PubSub from 'pubsub-js';
import Config from '../shared/Config';
import { WEBSOCKET_CLOSE, WEBSOCKET_ERROR } from '../shared/EventTypes';
import { ApplicationState } from '../shared/state';
import eventResponses from './websocket_events/EventResponses';
const { Settings } = Config;

export class GameWebSocket extends WebSocket {
    /**
     * Event emit helper. Attach this to a socket, and use it to send an event to the server.
     */
    sendEvent = (eventName: string, data?: any) => {
        ApplicationState.connection?.send(JSON.stringify({ eventName, data }));
    };

    // Wait for the connection to have finished opening before attempting to join the world.
    onopen = () => {
        ApplicationState.setConnected(true);
    };

    onmessage = (event: MessageEvent) => {
        // The data is JSON, so parse it.
        const parsedMessage = JSON.parse(event.data);

        const { eventName } = parsedMessage;

        // Check there is a response function to run for the event.
        if (eventResponses[eventName] !== undefined) {
            // Run the response, giving it any data.
            // Need to check for if any data was given at all, otherwise falsy values
            // like 0 and false would be ignored, even though they are valid values.
            if (parsedMessage.data === undefined) {
                eventResponses[eventName]({});
            }
            else {
                eventResponses[eventName](parsedMessage.data);
            }
        }
        // Event response is missing. It might have not been added yet (game state still
        // loading), so store it for now so this missed event can be re-ran when they have
        // finished loading (and the game event responses are added) so they can be
        // fastforwarded to the current game world state.
        else if (parsedMessage.data === undefined) {
            ApplicationState.addMissedWebsocketEvent({ eventName, data: {} });
        }
        else {
            ApplicationState.addMissedWebsocketEvent({ eventName, data: parsedMessage.data });
        }
    };

    onclose = () => {
        message('Disconnected from game server.');

        ApplicationState.connection = null;

        // Do this first, otherwise the current state is lost and can't tell if it
        // was initial connection failure, or failure while already connected.
        PubSub.publish(WEBSOCKET_CLOSE, getErrorCategory());

        ApplicationState.setJoined(false);
        ApplicationState.setJoining(false);
        ApplicationState.setConnected(false);
        ApplicationState.setConnecting(false);
    };

    onerror = (error: Event) => {
        message('Websocket error:', error);

        PubSub.publish(WEBSOCKET_ERROR, error);
    };
}

export enum ConnectionCloseTypes {
    // No connection made yet. User has no internet access.
    CANNOT_CONNECT_NO_INTERNET,
    // No connection made yet. Connection can't be made to server.
    CANNOT_CONNECT_NO_SERVER,
    // Already connected. User lost internet access.
    DISCONNECTED_NO_INTERNET,
    // Already connected. Server crashed or something.
    DISCONNECTED_NO_SERVER,
}

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
 * @returns Whether a the function finished without a problem.
 */
export const connectToGameServer = () => {
    const gameServiceBaseURL = `${Settings.GAME_SERVICE_IP_ADDRESS}:${Settings.GAME_SERVICE_PORT}`;

    if(Settings.USE_SECURE_PROTOCOLS) {
        // Live or test. Connect to server, which should be using SSL.
        ApplicationState.gameServiceHTTPServerURL = `https://${gameServiceBaseURL}`;
        ApplicationState.gameServiceWebSocketServerURL = `wss://${gameServiceBaseURL}`;
        ApplicationState.mapServiceHTTPServerURL = `https://${Settings.MAP_SERVICE_IP_ADDRESS}:${Settings.MAP_SERVICE_PORT}`;
    }
    else {
        // Connect without SSL for environments (localhost) that don't need it.
        ApplicationState.gameServiceHTTPServerURL = `http://${gameServiceBaseURL}`;
        ApplicationState.gameServiceWebSocketServerURL = `ws://${gameServiceBaseURL}`;
        ApplicationState.mapServiceHTTPServerURL = `http://${Settings.MAP_SERVICE_IP_ADDRESS}:${Settings.MAP_SERVICE_PORT}`;
    }

    if (ApplicationState.connected || ApplicationState.connecting) {
        return false;
    }

    // Connect to the game server.
    ApplicationState.connection = new GameWebSocket(ApplicationState.gameServiceWebSocketServerURL);

    ApplicationState.setConnecting(true);

    return true;
};

export const joinGameNewCharacter = (characterName: string) => {
    ApplicationState.connection?.sendEvent('new_char', { displayName: characterName });

    ApplicationState.setJoining(true);
};

export const joinGameContinue = async(username: string, password: string) => {
    // Check username and password are valid.
    if (username === '') return;
    if (password === '') return;

    // Encrypt the password before sending.
    const hash = await digestMessage(password);

    ApplicationState.connection?.sendEvent('log_in', {
        username,
        password: hash,
    });

    ApplicationState.setJoining(true);
};
