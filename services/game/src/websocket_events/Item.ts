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

/**
 * @param clientSocket
 * @param data - The index in the crafting recipes list of the thing to craft.
 */
EventResponses.craft_item = (clientSocket, data: number) => {
    // Allow 0.
    if (!Number.isFinite(data)) return;
    if (clientSocket.inGame === false) return;
    if (!clientSocket.entity) return;
    // Ignore this event if they are dead.
    if (clientSocket.entity?.hitPoints <= 0) return;

    clientSocket.entity.craft(data);
};
