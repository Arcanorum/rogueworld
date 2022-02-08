import WebSocket from 'ws';
import Player from '../entities/classes/Player';

class PlayerWebSocket extends WebSocket {
    entity: Player|null = null;

    sendEvent(eventName: string, data?: any) {
        // Check the connection is in the ready state.
        if (this.readyState === 1) {
            this.send(JSON.stringify({ eventName, data }));
        }
    }
}

export default PlayerWebSocket;
