import ChatScopes from '@dungeonz/types/src/ChatScopes';
import WebSocket from 'ws';
import Player from '../entities/classes/Player';
import { AccountDocument } from '../account';

type ChatMessageTimes = {
    [scope in ChatScopes]: number;
};

class PlayerWebSocket extends WebSocket {
    isAlive!: boolean;

    inGame!: boolean;

    account: AccountDocument | null = null;

    entity?: Player;

    nextMessageTimes!: ChatMessageTimes;

    sendEvent!: (eventName: string, data?: any) => void;

    /**
     * Sends an event to this socket, with optional data.
     */
    static sendEvent(this: PlayerWebSocket, eventName: string, data?: any) {
        // Check the connection is in the ready state.
        if (this.readyState === 1) {
            this.send(JSON.stringify({ eventName, data }));
        }
    }

    /**
     * Need to fuck around a bit here with adding our custom stuff to the websocket object as the
     * ws package doesn't facilitate using this custom websocket class as the constructor for the
     * websocket instances it passes to the server event callbacks.
     */
    static extend(clientSocket: PlayerWebSocket) {
        clientSocket.isAlive = true;
        clientSocket.inGame = false;
        clientSocket.nextMessageTimes = {
            LOCAL: 0,
            GLOBAL: 0,
            TRADE: 0,
        };
        clientSocket.sendEvent = this.sendEvent;
    }
}

export default PlayerWebSocket;
