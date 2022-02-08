import EventResponses from './EventResponses';
import PlayerWebSocket from './PlayerWebSocket';

const move = (clientSocket: PlayerWebSocket, rowOffset: number, colOffset: number) => {
    // Make sure they are in the game.
    if (clientSocket.inGame === false) return;

    if(!clientSocket.entity) return;

    // Ignore this event if they are dead.
    if (clientSocket.entity.hitPoints <= 0) return;

    clientSocket.entity.move(rowOffset, colOffset);
};

EventResponses.mv_u = (clientSocket) => {
    // console.log("move player up");
    move(clientSocket, -1, 0);
};

EventResponses.mv_d = (clientSocket) => {
    // console.log("move player down");
    move(clientSocket, 1, 0);
};

EventResponses.mv_l = (clientSocket) => {
    // console.log("move player left");
    move(clientSocket, 0, -1);
};

EventResponses.mv_r = (clientSocket) => {
    // console.log("move player right");
    move(clientSocket, 0, 1);
};
