import { Offset } from '@dungeonz/types';
import EventResponses from './EventResponses';
import PlayerWebSocket from './PlayerWebSocket';

const move = (clientSocket: PlayerWebSocket, rowOffset: Offset, colOffset: Offset) => {
    // Make sure they are in the game.
    if (clientSocket.inGame === false) return;

    if(!clientSocket.entity) return;

    // Ignore this event if they are dead.
    if (clientSocket.entity.hitPoints <= 0) return;

    clientSocket.entity.move(rowOffset, colOffset);
};

EventResponses.mv_u = (clientSocket) => move(clientSocket, -1, 0);

EventResponses.mv_d = (clientSocket) => move(clientSocket, 1, 0);

EventResponses.mv_l = (clientSocket) => move(clientSocket, 0, -1);

EventResponses.mv_r = (clientSocket) => move(clientSocket, 0, 1);

EventResponses.respawn = (clientSocket) => {
    if (clientSocket.inGame === false) return;
    // Ignore this event if they are alive.
    if (clientSocket.entity?.hitPoints > 0) return;

    clientSocket.entity?.respawn();
};
