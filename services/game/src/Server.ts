import { WebSocketServer } from 'ws';
import { Settings } from '@dungeonz/configs';
import { message } from '@dungeonz/utils';
import PlayerWebSocket from './websocket_events/PlayerWebSocket';

class GameWebSocketServer extends WebSocketServer {
    broadcastToInGame!: (eventName: string, data?: any) => void;

    clients: Set<PlayerWebSocket> = new Set();
}

const wss = new GameWebSocketServer({ port: Settings.GAME_SERVICE_PORT || 1111 });

message('WS server started.');

export default wss;
