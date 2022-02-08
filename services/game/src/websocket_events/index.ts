import {} from './';
import wss from '../Server';
import PlayerWebSocket from './PlayerWebSocket';
import { message, warning } from '@dungeonz/utils';
import EventResponses from './EventResponses';
import ClientSettings from './ClientSettings';

// "What is all this stuff below?"
// https://github.com/websockets/ws#how-to-detect-and-close-broken-connections

function noop() { }

function heartbeat() {
    this.isAlive = true;
}

function closeConnection(clientSocket: PlayerWebSocket) {
    message('Closing dead connection.');

    if (clientSocket.inGame === false) return;

    world.removePlayer(clientSocket);

    clientSocket.terminate();
}

function pingEach(clientSocket: PlayerWebSocket) {
    if (clientSocket.isAlive === false) {
        closeConnection(clientSocket);
    }
    clientSocket.isAlive = false;
    clientSocket.ping(noop);
}

function ping() {
    wss.clients.forEach(pingEach);
}

// How often to ping each client to see if the connection is still alive.
const pingRate = 30000;
setInterval(() => {
    ping();
}, pingRate);

/**
 * Broadcasts to all connected clients that are in the game.
 */
wss.broadcastToInGame = (eventName: string, data?: any) => {
    wss.clients.forEach((client: PlayerWebSocket) => {
        if (client.readyState === 1) {
            if (client.inGame === true) {
                client.send(JSON.stringify({ eventName, data }));
            }
        }
    });
};

wss.on('connection', (clientSocket: PlayerWebSocket) => {
    clientSocket.isAlive = true;
    clientSocket.on('pong', heartbeat);

    clientSocket.inGame = false;

    clientSocket.nextMessageTimes = {
        LOCAL: 0,
        GLOBAL: 0,
        TRADE: 0,
    };

    clientSocket.sendEvent('settings', ClientSettings);

    clientSocket.on('message', (payload: string) => {
        let parsedMessage;
        try {
            parsedMessage = JSON.parse(payload);
        }
        catch (e) {
            warning('message event, invalid payload:', payload);
            return;
        }

        const { eventName } = parsedMessage;

        // Check there is a response function to run for the event.
        if (EventResponses[eventName] !== undefined) {
            EventResponses[eventName](clientSocket, parsedMessage.data);
        }
    });

    clientSocket.on('close', () => {
        message('Client socket close event.');
        if (clientSocket.inGame === false) return;

        world.removePlayer(clientSocket);
    });
});
