import { WebSocketServer } from 'ws';
import { Settings } from '@dungeonz/configs';
import { message } from '@dungeonz/utils';

const wss = new WebSocketServer({ port: Settings.GAME_SERVER_PORT || 1111 });

message('WS server started.');

export default wss;
