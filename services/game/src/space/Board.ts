import { Counter } from '@dungeonz/utils';
import Entity from '../entities/classes/Entity';
import Pickup from '../entities/classes/Pickup';
import Player from '../entities/classes/Player';
import BoardTile from './BoardTile';

/**
 * Need this so that the loops in the functions that emit to players around the player view range go all the way to
 * the end of the bottom row and right column, otherwise the actual emit area will be the player view range - 1.
 * Precomputed value to avoid having to do `i <= playerViewRange`, or `i < playerViewRange + 1` every time.
 */
const playerViewRangePlusOne = Player.viewRange + 1;
const idCounter = new Counter();
const entitiesString = 'entities';
const playersString = 'players';
const pickupsString = 'pickups';

interface BoardConfig {
    mapData: Array<any>,
    name: string,
    alwaysNight: boolean,
    dungeon: any,
}

class Board {
    /**
     * A generic unique ID for this board.
     */
    id: number;

    /**
     * The name of this board to use on the client from the loaded maps data.
     */
    name: string;

    grid: Array<Array<BoardTile>>;

    constructor(config: BoardConfig) {
        this.id = idCounter.getNext();
        this.name = config.name;
        this.grid = [];
    }

    addEntity(entity: Entity) {
        const tile = this.grid[entity.row][entity.col];
        if (Object.prototype.hasOwnProperty.call(tile, entitiesString)) {
            tile.entities[entity.id] = entity;
        }
        else {
            tile.entities = {};

            tile.entities[entity.id] = entity;
        }
    }

    removeEntity(entity: Entity) {
        delete this.grid[entity.row][entity.col].entities[entity.id];
    }

    addPlayer(player: Player) {
        const tile = this.grid[player.row][player.col];
        if (Object.prototype.hasOwnProperty.call(tile, playersString)) {
            tile.players[player.id] = player;
        }
        else {
            tile.players = {};

            tile.players[player.id] = player;
        }
        // Players are also added to the destroyables list, in the constructor of Destroyable. // TODO: not true any more
    }

    removePlayer(player: Player) {
        delete this.grid[player.row][player.col].players[player.id];
        // Players are also removed from the destroyables list, in the onDestroy of Destroyable. // TODO: not true any more
    }

    addPickup(pickup: Pickup) {
        const tile = this.grid[pickup.row][pickup.col];
        if (Object.prototype.hasOwnProperty.call(tile, pickupsString)) {
            tile.pickups[pickup.id] = pickup;
        }
        else {
            tile.pickups = {};

            tile.pickups[pickup.id] = pickup;
        }
    }

    removePickup(pickup: Pickup) {
        delete this.grid[pickup.row][pickup.col].pickups[pickup.id];
    }

    /**
     * Send an event name ID and optional data to all players around the target position.
     * @param row Target row on this board to emit to players around.
     * @param col Target column on this board to emit to players around.
     * @param eventName The name of the event to send.
     * @param data Any optional data to send with the event.
     * @param range A specific range to define "nearby" to be, otherwise uses the player view range + 1.
     */
    emitToNearbyPlayers(row: number, col: number, eventName: string, data?: any, range?: number) {
        let nearbyRange = Player.viewRange;
        let nearbyRangePlusOne = playerViewRangePlusOne;

        if (range !== undefined) {
            nearbyRange = range;
            nearbyRangePlusOne = range + 1;
        }

        const { grid } = this;

        let rowOffset = -nearbyRange;
        let colOffset = -nearbyRange;
        let targetRow;
        let targetCol;
        let players;

        for (; rowOffset < nearbyRangePlusOne; rowOffset += 1) {
            for (colOffset = -nearbyRange; colOffset < nearbyRangePlusOne; colOffset += 1) {
                targetRow = rowOffset + row;
                // Check the grid element being accessed is valid.
                // eslint-disable-next-line no-continue
                if (grid[targetRow] === undefined) continue;
                targetCol = colOffset + col;
                // eslint-disable-next-line no-continue
                if (grid[targetRow][targetCol] === undefined) continue;

                players = grid[targetRow][targetCol].players;

                this.emitToPlayers(players, eventName, data);
            }
        }
    }

    /**
     * Send an event name ID and optional data to all given players.
     * @param players The list of Player entities to send the event to.
     * @param eventName The name of the event to send.
     * @param data Any optional data to send with the event.
     */
    emitToPlayers(players: object, eventName: string, data?: any) {
        // Find all of the player entities on this board tile.
        Object.values(players).forEach((player) => {
            const { socket } = player;
            // Make sure this socket connection is in a ready state. Might have just closed or be closing.
            if (socket.readyState === 1) {
                socket.sendEvent(eventName, data);
            }
        });
    }
}

export default Board;
