import ChatScopes from '@dungeonz/types/src/ChatScopes';
import WebSocket from 'ws';
import Player from '../entities/classes/Player';
import { AccountDocument } from '../account';

type ChatMessageTimes = {
    [scope in ChatScopes]: number;
};

class PlayerWebSocket extends WebSocket {
    isAlive = false;

    inGame = false;

    account: AccountDocument | null = null;

    entity: Player | null = null;

    nextMessageTimes: ChatMessageTimes = {
        LOCAL: 0,
        GLOBAL: 0,
        TRADE: 0,
    };


    /**
     * Sends an event to this socket, with optional data.
     */
    sendEvent(eventName: string, data?: any) {
        // Check the connection is in the ready state.
        if (this.readyState === 1) {
            this.send(JSON.stringify({ eventName, data }));
        }
    }
}

export default PlayerWebSocket;
