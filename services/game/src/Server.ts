import { Settings } from '@dungeonz/configs';
import { message } from '@dungeonz/utils';
import express from 'express';
import { WebSocketServer } from 'ws';
import PlayerWebSocket from './websocket_events/PlayerWebSocket';

export const expressServer = express();

const httpServer = expressServer.listen(Settings.GAME_SERVICE_PORT || 1111);
message('HTTP server started.');

class GameWebSocketServer extends WebSocketServer {
    broadcastToInGame!: (eventName: string, data?: any) => void;

    clients: Set<PlayerWebSocket> = new Set();
}

export const webSocketServer = new GameWebSocketServer({ server: httpServer });
message('WS server started.');
