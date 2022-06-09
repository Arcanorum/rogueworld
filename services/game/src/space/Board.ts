import { Settings } from '@rogueworld/configs';
import { MapLayer, TiledMap } from '@rogueworld/maps';
import { DayPhases, Directions, ObjectOfUnknown, OneSecond, RowCol } from '@rogueworld/types';
import { Counter, error, getRandomElement, getRandomIntInclusive, warning } from '@rogueworld/utils';
import { GroundTypes } from '.';
import { EntitiesList } from '../entities';
import Entity from '../entities/classes/Entity';
import Pickup from '../entities/classes/Pickup';
import Player from '../entities/classes/Player';
import BoardTile from './BoardTile';
import { groundTilesetTiles } from './CreateClientBoardData';
import { GroundTypeName, PlayerSpawn } from './GroundTypes';

const playerViewRange = Settings.PLAYER_VIEW_RANGE;
/**
 * Need this so that the loops in the functions that emit to players around the player view range go all the way to
 * the end of the bottom row and right column, otherwise the actual emit area will be the player view range - 1.
 * Precomputed value to avoid having to do `i <= playerViewRange`, or `i < playerViewRange + 1` every time.
 */
const playerViewRangePlusOne = playerViewRange + 1;
const idCounter = new Counter();
const entitiesString = 'entities';
const playersString = 'players';
const pickupsString = 'pickups';

class Board {
    /**
     * A generic unique ID for this board.
     */
    id: number = idCounter.getNext();

    /**
     * The name of this board to use on the client from the loaded maps data.
     */
    name: string;

    /**
     * The spatial representation for the game world where all entities exist.
     */
    grid: Array<Array<BoardTile>> = [];

    /**
     * A list of references to any movable entities by their ID.
     * Used for accessing an entity to be interacted with that may have moved from where a client
     * thinks it is, as just sending row & col (to get it via the entities list of a board tile)
     * won't be enough to always be able to get the entity.
     * Could just keep every entity in a list like this, but most of there references would be
     * redundant as the majority of entities on the board will most likely be non-moving things
     * like walls and resource nodes, which can be reliably accessed by row & col.
     */
    movables: {[key: number]: Entity} = {};

    /**
     * Keep a list of the positions that a player can spawn onto.
     * Can't just refer to the board tiles directly as they don't track their own row/col.
     */
    entranceTilePositions: Array<RowCol> = [];

    /**
     * What phase of the day it is. Each day is split up into phases, with each phase corresponding to a time of day (i.e. dusk).
     * Updated from World when the time changes.
     */
    dayPhase = 1;

    /**
     * Whether this board should always be night time, and will not observe changes in the world day phase.
     */
    alwaysNight: boolean;

    /**
     * How much "stuff" can be on the board at once.
     * These could be all kinds of entities.
     * Population is NOT a direct correlation with amount of entities, as some entities may have a
     * higher population weight, i.e. a rat might take 1 population space, but a boss might take 8.
     */
    maxPopulation = Settings.MAX_BOARD_POPULATION || 1000;

    /**
     * How many entities are currently on the board.
     */
    population = 0;

    /**
     * How often (in ms) to try to populate the board with a new entity.
     */
    populateRate = Settings.BOARD_POPULATION_RATE || (OneSecond * 5);

    populateLoop: NodeJS.Timeout;

    constructor({
        name,
        mapData,
        alwaysNight,
    }: {
        name: string;
        mapData: TiledMap;
        alwaysNight: boolean;
    }) {
        this.name = name;

        this.alwaysNight = alwaysNight;

        // If always night, then set time to night.
        if (this.alwaysNight === true) this.dayPhase = DayPhases.Night;

        this.init(mapData);

        this.populateLoop = setTimeout(this.populate.bind(this), this.populateRate);
    }

    init(mapData: TiledMap) {
        const findLayer = (layerName: string) => {
            const foundLayer = mapData.layers.find((eachLayer) => eachLayer.name === layerName);

            if (foundLayer) return foundLayer;

            warning(`Couldn't find tilemap layer '${layerName}' for board ${this.name}.`);
            return;
        };

        let i = 0;
        let j = 0;
        let len = 0;
        let tilesData: Array<number>;
        // A tile layer tile on the tilemap data.
        let mapTile: number;
        let type: GroundTypeName;
        let row: number;
        let col: number;

        // Initialise an empty grid, with a board tile instance for each column in each row.
        for (i = 0; i < mapData.height; i += 1) {
            // Add a new row.
            this.grid[i] = [];

            for (j = 0; j < mapData.width; j += 1) {
                // Add a board tile to the grid.
                this.grid[i].push(new BoardTile());
            }
        }

        // Check that the ground layer exists in the map data.
        const layer: MapLayer | undefined = findLayer('Ground');
        if (layer) {
            tilesData = layer.data;
            row = 0;
            col = 0;

            // Add the tiles to the grid.
            for (i = 0, len = tilesData.length; i < len; i += 1) {
                mapTile = tilesData[i] - 1;

                if (groundTilesetTiles[mapTile] === undefined) {
                    error(`Invalid/empty map tile found while creating board: ${this.name} at row: ${row}, col: ${col}`);
                }
                // Get and separate the type from the prefix using the tile GID.
                type = groundTilesetTiles[mapTile].type;
                // Move to the next row when at the width of the map.
                if (col === mapData.width) {
                    col = 0;
                    row += 1;
                }
                // Check that the type of this tile is a valid one.
                if (GroundTypes[type]) {
                    // Assign it to the matching ground type object of the type of this tile.
                    this.grid[row][col].groundType = GroundTypes[type];

                    if(GroundTypes[type] === PlayerSpawn) {
                        this.entranceTilePositions.push({ row, col });
                    }
                }
                else {
                    warning(`Invalid ground mapTile type: ${type}`);
                }
                // Move to the next column.
                col += 1;
            }
        }
    }

    addEntity(entity: Entity) {
        // Add movable entities to the movables list.
        const EntityType = entity.constructor as typeof Entity;
        if(EntityType.baseMoveRate) {
            this.movables[entity.id] = entity;
        }

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
        // If the entity was added to the movables list, remove them from it.
        if(this.movables[entity.id]) {
            delete this.movables[entity.id];
        }

        const tile = this.grid[entity.row][entity.col];

        delete tile.entities[entity.id];

        // Free up this tile if there is nothing else on it.
        if(!tile.containsAnyEntities()) {
            // Little hack to avoid making this property optional (as it still exists on the prototype).
            delete (tile as any).entities;
        }
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
        // Players are also added to the entities list, in the constructor of Entity.
    }

    removePlayer(player: Player) {
        const tile = this.grid[player.row][player.col];

        delete tile.players[player.id];
        // Players are also removed from the entities list, in the onDestroy of Entity.

        // Free up this tile if there is nothing else on it.
        if(!tile.containsAnyPlayers()) {
            // Little hack to avoid making this property optional (as it still exists on the prototype).
            delete (tile as any).players;
        }
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
        const tile = this.grid[pickup.row][pickup.col];

        delete tile.pickups[pickup.id];

        // Free up this tile if there is nothing else on it.
        if(!tile.containsAnyPickups()) {
            // Little hack to avoid making this property optional (as it still exists on the prototype).
            delete (tile as any).pickups;
        }
    }

    populate() {
        this.populateLoop = setTimeout(this.populate.bind(this), this.populateRate);

        // Don't go over the max population for this board.
        if(this.population >= this.maxPopulation) return;

        // Get a random position on the map.
        const rows = this.grid.length;
        const cols = this.grid[0].length;
        const clusterRow = 400; //getRandomIntInclusive(0, rows - 1);
        const clusterCol = 900; //getRandomIntInclusive(0, cols - 1);
        const clusterBoardTile = this.grid[clusterRow][clusterCol];
        const clusterSize = 50;
        const spreadRange = 20;

        const SpawnableEntityTypes = Object
            .values(EntitiesList.BY_NAME)
            .filter((EntityType) => EntityType.baseGloryValue);

        // const SpawnableEntityTypes = [
        //     EntitiesList.BY_NAME['Bandit'],
        //     EntitiesList.BY_NAME['Bat'],
        //     EntitiesList.BY_NAME['IronRocks'],
        //     EntitiesList.BY_NAME['PineTree'],
        //     EntitiesList.BY_NAME['StoneWall'],
        // ];

        // const houseLayout = [
        //     { row: -2, col: -1 },
        //     { row: -2, col: 0 },
        //     { row: -2, col: 1 },
        //     { row: -2, col: 2 },
        //     { row: -1, col: -1 },
        //     { row: -1, col: 2 },
        //     { row: 0, col: -1 },
        //     { row: 0, col: 2 },
        //     { row: 1, col: -1 },
        //     { row: 1, col: 1 },
        //     { row: 1, col: 2 },
        // ];

        const RandomEntityType = getRandomElement(SpawnableEntityTypes);

        for(let i = 0; i < clusterSize; i += 1) {
            const randomRow = clusterRow + getRandomIntInclusive(-spreadRange, spreadRange);
            const randomCol = clusterCol + getRandomIntInclusive(-spreadRange, spreadRange);
            const randomBoardTile = this.getTileAt(randomRow, randomCol);

            if(!randomBoardTile) return;
            if(!randomBoardTile.groundType.canBeStoodOn) return;
            if(!randomBoardTile.isBuildable()) return;
            if(randomBoardTile.groundType.hazardous) return;
            if(randomBoardTile.groundType === PlayerSpawn) return;

            new RandomEntityType({
                row: randomRow,
                col: randomCol,
                board: this,
            }).emitToNearbyPlayers();

            this.population += 1;

            // Don't go over the max population for this board.
            if(this.population >= this.maxPopulation) break;

            // console.log('pop:', this.population, ', type:', RandomEntityType.typeName, ', spawned at:', clusterRow, clusterCol);
        }
    }

    /**
     * Get all of the dynamic entities that are within the player view range of the target position.
     * @returns Returns an array containing the entities found.
     */
    getNearbyDynamicsData(row: number, col: number) {
        const nearbyDynamics: Array<ObjectOfUnknown> = [];

        // How far around the target position to get data from.
        let rowOffset = -playerViewRange;
        let colOffset = -playerViewRange;
        let currentRow: Array<BoardTile>;
        let currentTile: BoardTile;
        let entities: { [key: string]: Entity };

        for (; rowOffset < playerViewRangePlusOne; rowOffset += 1) {
            for (colOffset = -playerViewRange; colOffset < playerViewRangePlusOne; colOffset += 1) {
                currentRow = this.grid[row + rowOffset];
                // Check for invalid array index access.
                // eslint-disable-next-line no-continue
                if (!currentRow) continue;
                currentTile = currentRow[col + colOffset];
                // eslint-disable-next-line no-continue
                if (!currentTile) continue;

                entities = currentTile.entities;

                // Get all of the entities on this board tile.
                Object.values(entities).forEach((entity) => {
                    // Add the relevant data of this entity to the data to return.
                    nearbyDynamics.push(
                        entity.getEmittableProperties({}),
                    );
                });
            }
        }

        return nearbyDynamics;
    }

    /**
     * Get all of the destroyables (and any interactables that are not in their default state) along the edge of the player view range in a given direction.
     * @param row
     * @param col
     * @param direction
     * @returns Returns an array containing the entities found, or false if none found.
     */
    getDynamicsAtViewRangeData(row: number, col: number, direction: Directions) {
        const edgeDynamics: Array<Entity> = [];

        let currentTile: BoardTile;

        if (direction === Directions.LEFT) {
            // Go to the left column of the view range, then loop down that column from the top of the view range to the bottom.
            for (let i = -playerViewRange; i < playerViewRangePlusOne; i += 1) {
                // Check for invalid array index access.
                // eslint-disable-next-line no-continue
                if (this.grid[row + i] === undefined) continue;
                currentTile = this.grid[row + i][col - playerViewRange];
                // eslint-disable-next-line no-continue
                if (currentTile === undefined) continue;

                currentTile.addToDynamicsList(edgeDynamics);
            }
        }
        else if (direction === Directions.RIGHT) {
            // Go to the right column of the view range, then loop down that column from the top of the view range to the bottom.
            for (let i = -playerViewRange; i < playerViewRangePlusOne; i += 1) {
                // Check for invalid array index access.
                // eslint-disable-next-line no-continue
                if (this.grid[row + i] === undefined) continue;
                currentTile = this.grid[row + i][col + playerViewRange];
                // eslint-disable-next-line no-continue
                if (currentTile === undefined) continue;

                currentTile.addToDynamicsList(edgeDynamics);
            }
        }
        else if (direction === Directions.UP) {
            // Go to the top row of the view range, then loop along that row from the left of the view range to the right.
            for (let i = -playerViewRange; i < playerViewRangePlusOne; i += 1) {
                // Check for invalid array index access.
                // eslint-disable-next-line no-continue
                if (this.grid[row - playerViewRange] === undefined) continue;
                currentTile = this.grid[row - playerViewRange][col + i];
                // eslint-disable-next-line no-continue
                if (currentTile === undefined) continue;

                currentTile.addToDynamicsList(edgeDynamics);
            }
        }
        else {
            // Go to the bottom row of the view range, then loop along that row from the left of the view range to the right.
            for (let i = -playerViewRange; i < playerViewRangePlusOne; i += 1) {
                // Check for invalid array index access.
                // eslint-disable-next-line no-continue
                if (this.grid[row + playerViewRange] === undefined) continue;
                currentTile = this.grid[row + playerViewRange][col + i];
                // eslint-disable-next-line no-continue
                if (currentTile === undefined) continue;

                currentTile.addToDynamicsList(edgeDynamics);
            }
        }

        // If there were no dynamics at the edge of the view range, return false.
        if (edgeDynamics.length === 0) return false;

        return edgeDynamics;
    }

    /**
     * Gets all Player entities within a given range around a target position.
     * @param row
     * @param col
     * @param range
     * @returns An array of Player entities.
     */
    getNearbyPlayers(row: number, col: number, range: number) {
        const nearbyPlayers: Array<Player> = [];
        const { grid } = this;
        const rangePlusOne = range + 1;

        let rowOffset = -range;
        let colOffset = -range;
        let targetRow: number;
        let targetCol: number;

        for (; rowOffset < rangePlusOne; rowOffset += 1) {
            for (colOffset = -range; colOffset < rangePlusOne; colOffset += 1) {
                targetRow = rowOffset + row;
                // Check the grid element being accessed is valid.
                // eslint-disable-next-line no-continue
                if (grid[targetRow] === undefined) continue;
                targetCol = colOffset + col;

                const tile = grid[targetRow][targetCol];
                // eslint-disable-next-line no-continue
                if (tile === undefined) continue;

                Object.values(tile.players)
                    .forEach((player) => {
                        nearbyPlayers.push(player);
                    });
            }
        }

        return nearbyPlayers;
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
        let nearbyRange = playerViewRange;
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

    /**
     * Sends an event name ID and optional data to all players at the edge of the view range in a direction.
     */
    emitToPlayersAtViewRange(
        row: number,
        col: number,
        direction: string,
        eventNameId: string,
        data?: any,
    ) {
        let currentRow;

        if (direction === Directions.LEFT) {
            // Go to the left column of the view range, then loop down that column from the top of the view range to the bottom.
            for (
                let rowOffset = -playerViewRange;
                rowOffset < playerViewRangePlusOne;
                rowOffset += 1
            ) {
                currentRow = this.grid[row + rowOffset];
                // Check for invalid array index access.
                // eslint-disable-next-line no-continue
                if (currentRow === undefined) continue;

                const tile = currentRow[col - playerViewRange];
                // eslint-disable-next-line no-continue
                if (!tile) continue;

                this.emitToPlayers(tile.players, eventNameId, data);
            }
        }
        else if (direction === Directions.RIGHT) {
            // Go to the right column of the view range, then loop down that column from the top of the view range to the bottom.
            for (
                let rowOffset = -playerViewRange;
                rowOffset < playerViewRangePlusOne;
                rowOffset += 1
            ) {
                currentRow = this.grid[row + rowOffset];
                // Check for invalid array index access.
                // eslint-disable-next-line no-continue
                if (currentRow === undefined) continue;

                const tile = currentRow[col + playerViewRange];
                // eslint-disable-next-line no-continue
                if (!tile) continue;

                this.emitToPlayers(tile.players, eventNameId, data);
            }
        }
        else if (direction === Directions.UP) {
            // Go to the top row of the view range, then loop along that row from the left of the view range to the right.
            for (
                let colOffset = -playerViewRange;
                colOffset < playerViewRangePlusOne;
                colOffset += 1
            ) {
                currentRow = this.grid[row - playerViewRange];
                // Check for invalid array index access.
                // eslint-disable-next-line no-continue
                if (currentRow === undefined) continue;

                const tile = currentRow[col + colOffset];
                // eslint-disable-next-line no-continue
                if (!tile) continue;

                this.emitToPlayers(tile.players, eventNameId, data);
            }
        }
        else {
            // Go to the bottom row of the view range, then loop along that row from the left of the view range to the right.
            for (
                let colOffset = -playerViewRange;
                colOffset < playerViewRangePlusOne;
                colOffset += 1
            ) {
                currentRow = this.grid[row + playerViewRange];
                // Check for invalid array index access.
                // eslint-disable-next-line no-continue
                if (currentRow === undefined) continue;

                const tile = currentRow[col + colOffset];
                // eslint-disable-next-line no-continue
                if (!tile) continue;

                this.emitToPlayers(tile.players, eventNameId, data);
            }
        }
    }

    /**
     * Gets the tile on this board at the given position.
     * Returns false if the position is invalid.
     */
    getTileAt(row: number, col: number) {
        // TODO: replace cases of ...board.grid[row][col] manaual tile validity checks with this method.
        if (this.grid[row] === undefined) return false;
        const tile = this.grid[row][col];
        // Check the grid col element (the tile itself) being accessed is valid.
        if (tile === undefined) return false;
        return tile;
    }
}

export default Board;
