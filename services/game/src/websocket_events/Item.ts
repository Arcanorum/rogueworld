import EventResponses from './EventResponses';

/**
 * Pick up an item pickup from the tile the player is on.
 */
EventResponses.pick_up_item = (clientSocket) => {
    if (clientSocket.inGame === false) return;
    // Ignore this event if they are dead.
    if (clientSocket?.entity?.hitPoints <= 0) return;

    clientSocket?.entity?.pickUpItem();
};
