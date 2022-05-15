import { Offset } from '@rogueworld/types';
import Entity from '../entities/classes/Entity';
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

EventResponses.interact = (clientSocket, data?: {id?: number; row?: number; col?: number}) => {
    if (clientSocket.inGame === false) return;
    // Ignore this event if they are alive.
    if (clientSocket.entity?.hitPoints <= 0) return;

    if(!data) return;

    console.log('doing interaction:', data);

    let targetEntity: Entity | undefined;

    if(data.id) {
        const playerEntity = clientSocket.entity;

        if(!playerEntity) return;

        // Check if it is in the movables list, so we can get a reference to it.
        if(playerEntity.board?.movables[data.id]) {
            targetEntity = playerEntity.board.movables[data.id];
        }
        // Non-movable entity, so access it by row/col, which should have been provided.
        else {
            if(data.row && data.col) {
                const boardTile = playerEntity.board?.getTileAt(data.row, data.col);
                if(!boardTile) return;

                targetEntity = boardTile.entities[data.id];
                if(!targetEntity) return;
            }
        }
    }

    clientSocket.entity?.performAction('punch', targetEntity, data.row, data.col);
};
