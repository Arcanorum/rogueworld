import { message } from '@dungeonz/utils';
import PlayerWebSocket from '../websocket_events/PlayerWebSocket';

const World = {

    init() {
        message('Starting game world.');
    },

    /**
     * Remove the given player from the world and the game.
     * @param clientSocket - The socket of the player entity to remove.
     */
    removePlayer(clientSocket: PlayerWebSocket) {
        return undefined;
    },
};

export default World;
