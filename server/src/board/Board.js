const fs = require('fs');
const Utils = require('../Utils');
const GroundTypes = require('./GroundTypes');
const groundTileset = require('../../map/tilesets/ground');
const boundariesTileset = require('../../map/tilesets/boundaries');
const staticsTileset = require('../../map/tilesets/statics');
const BoardTile = require('./BoardTile');
const EntitiesList = require('../EntitiesList');
const Player = require('../entities/destroyables/movables/characters/Player');
const DayPhases = require('../DayPhases');

// A recent version of Tiled changed the tileset.tiles property to be an array.
// Map the values back to an object by ID.
staticsTileset.tiles = staticsTileset.tiles.reduce((map, obj) => {
    map[obj.id] = obj;
    return map;
}, {});

const playerViewRange = EntitiesList["Player"].viewRange;
// Need this so that the loops in the functions that emit to players around the player view range go all the way to
// the end of the bottom row and right column, otherwise the actual emit area will be the player view range - 1.
// Precomputed value to avoid having to do `i <= playerViewRange` (2 checks), or `i < playerViewRange + 1` (repeated calculation).
const playerViewRangePlusOne = playerViewRange + 1;
const Directions = require('../entities/Entity').prototype.Directions;

// Sum the amount of tiles in each previous tileset to get the start GID of each tileset.
const boundariesStartGID = groundTileset.tilecount;
const staticsStartGID = groundTileset.tilecount + boundariesTileset.tilecount;

const idCounter = new Utils.Counter();

class Board {
    /**
     * A board for entities to exist on. The game world is made up of boards. Boards are made up of tiles.
     * @param {*} mapData
     * @param {String} [name="Unnamed board"]
     * @param {Boolean} [alwaysNight=false] - Whether this board will ignore changes in the time of day outside.
     * @param {Dungeon} [dungeon=null] - The dungeon instance that this board is for, if at all.
     */
    constructor(mapData, name, alwaysNight, dungeon) {
        /**
         * A generic unique ID for this board.
         * @type {Number}
         */
        this.id = idCounter.getNext();

        /**
         * The name of this board.
         * @type {String}
         */
        this.name = name || 'Unnamed board';

        /**
         * The container for all of the actual board tiles that make up the playable game space.
         * @type {Array}
         */
        this.grid = [];

        // How many Tiled units each grid cell is wide/high. Used to divide the x/y of an object to get the col/row.
        this.tileSize = Board.tileSize;

        // How many rows this board has.
        this.rows = 0;
        // How many columns this board has.
        this.cols = 0;

        // The area bounds of where things can come into a zone. Accessed by their entrance name.
        this.entrances = {};

        // The area bounds of where new entities will be spawned into a zone. Accessed by their entity id.
        this.spawners = {};

        /**
         * What phase of the day it is, i.e. Dawn, Day, Dusk, Night. Updated from World when the time changes.
         * @type {Number}
         */
        this.dayPhase = 1;

        /**
         * Whether this board should always be night time, and will not observe changes in the world day phase.
         * @type {Boolean}
         */
        this.alwaysNight = alwaysNight || false;
        // If always night, then set time to night.
        if (this.alwaysNight === true) this.dayPhase = DayPhases.Night;

        /** @type {Dungeon|null} Whether this board is for a dungeon, and any breakables inside it will not be breakable. */
        this.dungeon = dungeon || null;

        // The data to use to build the map.
        this.mapData = mapData;

        // Build the map.
        this.createBoard();
    }

    createBoard() {
        const mapData = this.mapData;

        this.rows = this.mapData.height;
        this.cols = this.mapData.width;

        // Load the map objects.
        // Check that there is some map data for the map of this board.
        if (mapData === undefined) {
            Utils.error("No map data found for this board when creating board " + this.name);
            return;
        }

        var i = 0,
            j = 0,
            len = 0,
            layer,
            findLayer = function (layerName) {
                for (var i = 0; i < mapData.layers.length; i += 1) {
                    if (mapData.layers[i].name === layerName) {
                        return mapData.layers[i];
                    }
                }
                Utils.warning("Couldn't find tilemap layer '" + layerName + "' for board " + this.name + '.');
                return false;
            };

        let tilesData;
        let objectsData;
        // A tile layer tile on the tilemap data.
        let mapTile;
        // An object layer tile on the tilemap data.
        let mapObject;
        let entity;
        let relativeID;
        let type;
        let row;
        let col;
        let dungeonStartEntranceFound = false;

        // Initialise an empty grid, with a board tile instance for each column in each row.
        for (i = 0; i < mapData.height; i += 1) {
            // Add a new row.
            this.grid[i] = [];

            for (j = 0; j < mapData.width; j += 1) {
                // Add a board tile to the grid.
                this.grid[i].push(new BoardTile());
            }
        }

        // Check that the boundaries layer exists in the map data.
        layer = findLayer('Boundaries');
        if (layer) {
            tilesData = layer.data;
            row = 0;
            col = 0;

            // Add the boundary properties to the grid.
            for (i = 0, len = tilesData.length; i < len; i += 1) {
                mapTile = tilesData[i] - 1;

                // Move to the next row when at the width of the map.
                if (col === mapData.width) {
                    col = 0;
                    row += 1;
                }

                // Get the ID of the tile relative to the tileset it belongs to.
                relativeID = mapTile - boundariesStartGID;

                if (boundariesTileset.tiles[relativeID] !== undefined) {
                    // Get and separate the type from the prefix using the tile GID.
                    type = boundariesTileset.tiles[relativeID].type;

                    // Check that the type of this tile is a valid one.
                    if (type === 'SafeZone') {
                        // Make this tile a safe zone.
                        this.grid[row][col].safeZone = true;
                    }
                }

                // Move to the next column.
                col += 1;
            }
        }

        // Check that the ground layer exists in the map data.
        layer = findLayer('Ground');
        if (layer) {
            tilesData = layer.data;
            row = 0;
            col = 0;

            // Add the tiles to the grid.
            for (i = 0, len = tilesData.length; i < len; i += 1) {
                mapTile = tilesData[i] - 1;

                if (groundTileset.tiles[mapTile] === undefined) {
                    Utils.error("Invalid/empty map tile found while creating board: " + this.name + " at row: " + row + ", col: " + col);
                }
                // Get and separate the type from the prefix using the tile GID.
                type = groundTileset.tiles[mapTile].type;
                // Move to the next row when at the width of the map.
                if (col === mapData.width) {
                    col = 0;
                    row += 1;
                }
                // Check that the type of this tile is a valid one.
                if (GroundTypes[type]) {
                    // Assign it to the matching ground type object of the type of this tile.
                    this.grid[row][col].groundType = GroundTypes[type];
                }
                else {
                    Utils.warning("Invalid ground mapTile type: " + type);
                }
                // Move to the next column.
                col += 1;
            }
        }

        // Check that the statics layer exists in the map data.
        layer = findLayer('Statics');
        if (layer) {
            tilesData = layer.data;
            row = 0;
            col = 0;

            // Add the tiles to the grid.
            for (i = 0, len = tilesData.length; i < len; i += 1) {
                mapTile = tilesData[i] - 1;

                // Move to the next row when at the width of the map.
                if (col === mapData.width) {
                    col = 0;
                    row += 1;
                }

                // Get the ID of the tile relative to the tileset it belongs to.
                relativeID = mapTile - staticsStartGID;

                // Relative IDs lower than 0 are for empty grid spaces.
                if (relativeID < 0) {
                    // Still need to move the column along.
                    col += 1;
                    // Skip this tile.
                    continue;
                }

                // Skip empty tiles.
                if (mapTile < 0) {
                    // Still need to move the column along.
                    col += 1;
                    // Skip this tile.
                    continue;
                }

                // A tile might have been placed on the map, but not have a type set.
                // All entities need to be created from a type.
                // Check a type is set.
                if (staticsTileset.tiles[relativeID] === undefined) {
                    // Still need to move the column along.
                    col += 1;
                    // Skip this tile.
                    continue;
                }
                // A type is set. Create an entity.

                // Get and separate the type from the prefix using the tile GID.
                type = staticsTileset.tiles[relativeID].type;

                // Check that the type of this tile is a valid one.
                if (EntitiesList[type]) {
                    // Create a new entity of the type of this tile.
                    new EntitiesList[type]({ row: row, col: col, board: this });
                }
                else {
                    //Utils.warning("Entity type doesn't exist for static mapTile type: " + type);
                }
                // Move to the next column.
                col += 1;
            }
        }

        // Check that the configurables layer exists in the map data.
        layer = findLayer('Configurables');
        if (layer) {
            // This is a object layer, not a tile one, so get the objects data.
            objectsData = layer.objects;

            // Add the entities to the world.
            for (i = 0, len = objectsData.length; i < len; i += 1) {
                mapObject = objectsData[i];

                // If this entity is a text object, skip it.
                if (mapObject.text !== undefined) {
                    continue;
                }

                // Reset this in case an invalid type was found below, otherwise this would still be the previous valid type.
                type = null;

                // Convert the object position in Tiled into a row and column.
                col = mapObject.x / this.tileSize;
                row = (mapObject.y / this.tileSize) - (mapObject.height / this.tileSize);

                // The ID of this tile on the statics tileset.
                const objectID = mapObject.gid - staticsStartGID - 1;

                // Get and separate the type from the prefix using the tile GID.
                type = staticsTileset.tiles[objectID].type;

                // Check that the type of this tile is a valid one.
                if (EntitiesList[type]) {
                    const config = {
                        row: row,
                        col: col,
                        board: this
                    };

                    // Check if the properties are already an array, as the map data object might have already
                    // been passed through createBoard and each of the properties converted to an object, such
                    // as another dungeon instance board being made from the same map data.
                    // TODO: do this on all map objects in the all map datas beforehand, so it isnt done every time a board instance is made.
                    if (Array.isArray(mapObject.properties)) {
                        mapObject.properties = Utils.arrayToObject(mapObject.properties, 'name', 'value');
                    }

                    if (mapObject.properties['Disabled']) {
                        Utils.warning("Map object is disabled in map data:", mapObject);
                        continue;
                    }

                    switch (type) {
                        case 'SpawnerArea':
                            config.width = mapObject.width / this.tileSize;
                            config.height = mapObject.height / this.tileSize;
                            config.entityType = EntitiesList[mapObject.properties['EntityClassName']];
                            config.maxAtOnce = mapObject.properties['MaxAtOnce'];
                            config.spawnRate = mapObject.properties['SpawnRate'];
                            config.testing = mapObject.properties['Testing'];
                            config.dropList = mapObject.properties['DropList'];
                            if (
                                mapObject.properties['RedKeys'] ||
                                mapObject.properties['GreenKeys'] ||
                                mapObject.properties['BlueKeys'] ||
                                mapObject.properties['YellowKeys'] ||
                                mapObject.properties['BrownKeys']
                            ) {
                                config.dungeonKeys = {}
                                if (mapObject.properties['RedKeys']) config.dungeonKeys.red = mapObject.properties['RedKeys'];
                                if (mapObject.properties['GreenKeys']) config.dungeonKeys.green = mapObject.properties['GreenKeys'];
                                if (mapObject.properties['BlueKeys']) config.dungeonKeys.blue = mapObject.properties['BlueKeys'];
                                if (mapObject.properties['YellowKeys']) config.dungeonKeys.yellow = mapObject.properties['YellowKeys'];
                                if (mapObject.properties['BrownKeys']) config.dungeonKeys.brown = mapObject.properties['BrownKeys'];
                            }
                            // Check the entity type to create is valid.
                            if (config.entityType === undefined) {
                                Utils.warning("Spawner invalid configuration. Entity type to spawn doesn't exist:", mapObject.properties['EntityClassName']);
                                continue;
                            }
                            break;
                        case 'Exit':
                            config.targetBoard = mapObject.properties['TargetBoard'];
                            config.targetEntranceName = mapObject.properties['TargetEntranceName'];
                            break;
                        case 'DungeonPortal':
                            // Check the dungeon portal properties are valid.
                            if (mapObject.properties === undefined) {
                                Utils.error("No properties set on dungeon portal in map data:", mapObject);
                                continue;
                            }
                            config.dungeonName = mapObject.properties['DungeonName'];
                            if (config.dungeonName === undefined) {
                                Utils.error(`Dungeon portal on map "${this.name}" is missing property "DungeonName". Map object:`, mapObject);
                                continue;
                            }
                            break;
                        case 'OverworldPortal':
                            config.targetBoard = mapObject.properties['TargetBoard'];
                            config.targetEntranceName = mapObject.properties['TargetEntranceName'];
                            config.activeState = mapObject.properties['ActiveState'];
                            break;
                        case 'Entrance':
                            config.width = mapObject.width / this.tileSize;
                            config.height = mapObject.height / this.tileSize;
                            config.entranceName = mapObject.properties['EntranceName'];
                            if (config.entranceName === "dungeon-start") {
                                dungeonStartEntranceFound = true;
                            }
                            break;
                    }

                    // Create a new entity of the type of this tile.
                    new EntitiesList[type](config);
                }
                else {
                    //Utils.warning("Entity type doesn't exist for configurable object type: " + type);
                }
            }
        }

        // Dungeon maps must have an entrance named "dungeon-start".
        if (this.dungeon) {
            if (dungeonStartEntranceFound === false) Utils.error('Dungeon map does not have an entrance named "dungeon-start". Map name:', this.name);
        }

        // No longer need the map data.
        this.mapData = undefined;
    }

    destroy() {
        console.log("board destroy:", this.id);

        // Need to remove all references from the board to the entity,
        // and also the entity to the board (done in Entity.onDestroy.

        // Destroy all current entities on the board.
        this.grid.forEach((row) => {
            row.forEach((boardTile) => {
                // Not all tiles might have a static on them.
                if (boardTile.static) {
                    boardTile.static.destroy();
                }

                Object.values(boardTile.destroyables).forEach((destroyable) => destroyable.destroy());
            })
        });

        this.entrances = null;

        Object.values(this.spawners).forEach((spawner) => spawner.destroy());

        this.spawners = null;
    }

    /**
     * @param {Destroyable} entity
     */
    addDestroyable(entity) {
        this.grid[entity.row][entity.col].destroyables[entity.id] = entity;
    }

    /**
     * @param {Destroyable} entity
     */
    removeDestroyable(entity) {
        delete this.grid[entity.row][entity.col].destroyables[entity.id];
    }

    /**
     * @param {Player} player
     */
    addPlayer(player) {
        this.grid[player.row][player.col].players[player.id] = player;
        // Players are also added to the destroyables list, in the constructor of Destroyable.
    }

    /**
     * @param {Player} player
     */
    removePlayer(player) {
        delete this.grid[player.row][player.col].players[player.id];
        // Players are also removed from the destroyables list, in the onDestroy of Destroyable.
    }

    /**
     * @param {Static} entity
     */
    addStatic(entity) {
        this.grid[entity.row][entity.col].static = entity;
    }

    /**
     * Used to remove buildables (clan structures), and all statics when a board is destroyed.
     * Entrances occupy the static slots of the whole area they cover, so all of it won't be cleaned up if removed.
     * @param {Static} entity
     */
    removeStatic(entity) {
        delete this.grid[entity.row][entity.col].static;
    }

    /**
     * @param {Pickup} entity
     */
    addPickup(entity) {
        this.grid[entity.row][entity.col].pickups[entity.id] = entity;
    }

    /**
     * @param {Pickup} entity
     */
    removePickup(entity) {
        delete this.grid[entity.row][entity.col].pickups[entity.id];
    }

    /**
     * Get all of the destroyables (and any interactables that are not in their default state) that are within the player view range of the target position.
     * @param {Number} row
     * @param {Number} col
     * @return {Array} Returns an array containing the entities found.
     */
    getNearbyDynamicsData(row, col) {
        /** @type {Array} */
        const nearbyDynamics = [];

        // How far around the target position to get data from.
        /** @type {Number} */
        let rowOffset = -playerViewRange,
            colOffset = -playerViewRange,
            currentRow,
            /** @type {BoardTile} */
            currentTile,
            /** @type {Object} */
            destroyables,
            /** @type {String} */
            entityKey,
            /** @type {Interactable} */
            interactable;

        for (; rowOffset < playerViewRangePlusOne; rowOffset += 1) {
            for (colOffset = -playerViewRange; colOffset < playerViewRangePlusOne; colOffset += 1) {

                currentRow = this.grid[row + rowOffset];
                // Check for invalid array index access.
                if (currentRow === undefined) continue;
                currentTile = currentRow[col + colOffset];
                if (currentTile === undefined) continue;

                destroyables = currentTile.destroyables;
                // Get all of the destroyable entities on this board tile.
                for (entityKey in destroyables) {
                    if (destroyables.hasOwnProperty(entityKey)) {
                        // Add the relevant data of this entity to the data to return.
                        nearbyDynamics.push(
                            destroyables[entityKey].getEmittableProperties({})
                        );
                    }
                }

                // Now get the state of the interactable if it isn't in its default state.
                interactable = currentTile.static;
                // Check there is actually one there.
                if (interactable !== null) {
                    // Check if it is not in its default state. If not, add it to the data.
                    // Also checks if it is actually an interactable.
                    if (interactable.activeState === false) {
                        // Add the relevant data of this entity to the data to return.
                        nearbyDynamics.push(
                            interactable.getEmittableProperties({})
                        );
                    }
                }
            }
        }

        return nearbyDynamics;
    }

    /**
     * Get all of the destroyables (and any interactables that are not in their default state) along the edge of the player view range in a given direction.
     * @param {Number} row
     * @param {Number} col
     * @param {String} direction
     * @return {Array|Boolean} Returns an array containing the entities found, or false if none found.
     */
    getDynamicsAtViewRangeData(row, col, direction) {
        /** @type {Array} */
        const edgeDynamics = [];

        /** @type {BoardTile} */
        let currentTile,
            /** @type {Object} */
            destroyables,
            /** @type {String} */
            entityKey,
            /** @type {Interactable} */
            interactable;

        if (direction === Directions.LEFT) {
            // Go to the left column of the view range, then loop down that column from the top of the view range to the bottom.
            for (let i = -playerViewRange; i < playerViewRangePlusOne; i += 1) {

                // Check for invalid array index access.
                if (this.grid[row + i] === undefined) continue;
                currentTile = this.grid[row + i][col - playerViewRange];
                if (currentTile === undefined) continue;

                destroyables = currentTile.destroyables;
                // Get all of the destroyable entities on this board tile.
                for (entityKey in destroyables) {
                    if (destroyables.hasOwnProperty(entityKey)) {
                        // Add the relevant data of this entity to the data to return.
                        edgeDynamics.push(
                            destroyables[entityKey].getEmittableProperties({})
                        );
                    }
                }

                // Now get the state of the interactable if it isn't in its default state.
                interactable = currentTile.static;
                // Check there is actually one there.
                if (interactable !== null) {
                    // Check if it is not in its default state. If not, add it to the data.
                    // Also checks if it is actually an interactable.
                    if (interactable.activeState === false) {
                        // Add the relevant data of this entity to the data to return.
                        edgeDynamics.push(
                            interactable.getEmittableProperties({})
                        );
                    }
                }
            }
        }
        else if (direction === Directions.RIGHT) {
            // Go to the right column of the view range, then loop down that column from the top of the view range to the bottom.
            for (let i = -playerViewRange; i < playerViewRangePlusOne; i += 1) {

                // Check for invalid array index access.
                if (this.grid[row + i] === undefined) continue;
                currentTile = this.grid[row + i][col + playerViewRange];
                if (currentTile === undefined) continue;

                destroyables = currentTile.destroyables;
                // Get all of the destroyable entities on this board tile.
                for (entityKey in destroyables) {
                    if (destroyables.hasOwnProperty(entityKey)) {
                        // Add the relevant data of this entity to the data to return.
                        edgeDynamics.push(
                            destroyables[entityKey].getEmittableProperties({})
                        );
                    }
                }

                // Now get the state of the interactable if it isn't in its default state.
                interactable = currentTile.static;
                // Check there is actually one there.
                if (interactable !== null) {
                    // Check if it is not in its default state. If not, add it to the data.
                    // Also checks if it is actually an interactable.
                    if (interactable.activeState === false) {
                        // Add the relevant data of this entity to the data to return.
                        edgeDynamics.push(
                            interactable.getEmittableProperties({})
                        );
                    }
                }
            }
        }
        else if (direction === Directions.UP) {
            // Go to the top row of the view range, then loop along that row from the left of the view range to the right.
            for (let i = -playerViewRange; i < playerViewRangePlusOne; i += 1) {

                // Check for invalid array index access.
                if (this.grid[row - playerViewRange] === undefined) continue;
                currentTile = this.grid[row - playerViewRange][col + i];
                if (currentTile === undefined) continue;

                destroyables = currentTile.destroyables;
                // Get all of the destroyable entities on this board tile.
                for (entityKey in destroyables) {
                    if (destroyables.hasOwnProperty(entityKey)) {
                        // Add the relevant data of this entity to the data to return.
                        edgeDynamics.push(
                            destroyables[entityKey].getEmittableProperties({})
                        );
                    }
                }

                // Now get the state of the interactable if it isn't in its default state.
                interactable = currentTile.static;
                // Check there is actually one there.
                if (interactable !== null) {
                    // Check if it is not in its default state. If not, add it to the data.
                    // Also checks if it is actually an interactable.
                    if (interactable.activeState === false) {
                        // Add the relevant data of this entity to the data to return.
                        edgeDynamics.push(
                            interactable.getEmittableProperties({})
                        );
                    }
                }
            }
        }
        else {
            // Go to the bottom row of the view range, then loop along that row from the left of the view range to the right.
            for (let i = -playerViewRange; i < playerViewRangePlusOne; i += 1) {

                // Check for invalid array index access.
                if (this.grid[row + playerViewRange] === undefined) continue;
                currentTile = this.grid[row + playerViewRange][col + i];
                if (currentTile === undefined) continue;

                destroyables = currentTile.destroyables;
                // Get all of the destroyable entities on this board tile.
                for (entityKey in destroyables) {
                    if (destroyables.hasOwnProperty(entityKey)) {
                        // Add the relevant data of this entity to the data to return.
                        edgeDynamics.push(
                            destroyables[entityKey].getEmittableProperties({})
                        );
                    }
                }

                // Now get the state of the interactable if it isn't in its default state.
                interactable = currentTile.static;
                // Check there is actually one there.
                if (interactable !== null) {
                    // Check if it is not in its default state. If not, add it to the data.
                    // Also checks if it is actually an interactable.
                    if (interactable.activeState === false) {
                        // Add the relevant data of this entity to the data to return.
                        edgeDynamics.push(
                            interactable.getEmittableProperties({})
                        );
                    }
                }
            }
        }

        // If there were no dynamics at the edge of the view range, return false.
        if (edgeDynamics.length === 0) return false;

        return edgeDynamics;
    }

    /**
     * Gets all Player entities within a given range around a target position.
     * @param {Number} row
     * @param {Number} col
     * @param {Number} range
     * @returns {Array} An array of Player entities.
     */
    getNearbyPlayers(row, col, range) {
        const nearbyPlayers = [],
            grid = this.grid,
            rangePlusOne = range + 1;

        let rowOffset = -range,
            colOffset = -range,
            targetRow,
            targetCol,
            playerKey,
            players;

        for (; rowOffset < rangePlusOne; rowOffset += 1) {
            for (colOffset = -range; colOffset < rangePlusOne; colOffset += 1) {
                targetRow = rowOffset + row;
                // Check the grid element being accessed is valid.
                if (grid[targetRow] === undefined) continue;
                targetCol = colOffset + col;
                if (grid[targetRow][targetCol] === undefined) continue;

                players = grid[targetRow][targetCol].players;

                for (playerKey in players) {
                    if (players.hasOwnProperty(playerKey) === false) continue;

                    nearbyPlayers.push(players[playerKey]);
                }
            }
        }

        return nearbyPlayers;
    }

    /**
     * Send an event name ID and optional data to all players around the target position.
     * @param {Number} row
     * @param {Number} col
     * @param {String} eventNameID - Use one of the valid event names from EventsList.js.
     * @param {*} [data] - Any optional data to send with the event.
     * @param {Number} [range=playerViewRangePlusOne] - A specific range to define 'nearby' to be, otherwise uses the player view range + 1.
     */
    emitToNearbyPlayers(row, col, eventNameID, data, range) {
        let nearbyRange = playerViewRange,
            nearbyRangePlusOne = playerViewRangePlusOne;

        if (range !== undefined) {
            nearbyRange = range;
            nearbyRangePlusOne = range + 1;
        }

        const grid = this.grid;

        let rowOffset = -nearbyRange,
            colOffset = -nearbyRange,
            targetRow,
            targetCol,
            propIndex = 0,
            players,
            ownPropNames,
            socket;

        for (; rowOffset < nearbyRangePlusOne; rowOffset += 1) {
            for (colOffset = -nearbyRange; colOffset < nearbyRangePlusOne; colOffset += 1) {
                targetRow = rowOffset + row;
                // Check the grid element being accessed is valid.
                if (grid[targetRow] === undefined) continue;
                targetCol = colOffset + col;
                if (grid[targetRow][targetCol] === undefined) continue;

                players = grid[targetRow][targetCol].players;

                ownPropNames = Object.getOwnPropertyNames(players);

                for (propIndex = 0; propIndex < ownPropNames.length; propIndex += 1) {
                    socket = players[ownPropNames[propIndex]].socket;
                    // Make sure this socket connection is in a ready state. Might have just closed or be closing.
                    if (socket.readyState === 1) {
                        socket.sendEvent(eventNameID, data);
                    }
                }
            }
        }
    }

    /**
     * Send an event name ID and optional data to all given players.
     * @param {Object} players - The list of Player entities to send the event to.
     * @param {String} eventNameID - Use one of the valid event names from EventsList.js.
     * @param {*} [data] - Any optional data to send with the event.
     */
    emitToPlayers(players, eventNameID, data) {
        let playerKey;
        // Find all of the player entities on this board tile.
        for (playerKey in players) {
            if (players.hasOwnProperty(playerKey)) {
                // Make sure this socket connection is in a ready state. Might have just closed or be closing.
                if (players[playerKey].socket.readyState === 1) {
                    players[playerKey].socket.sendEvent(eventNameID, data);
                }
            }
        }
    }

    /**
     * Sends an event name ID and optional data to all players at the edge of the view range in a direction.
     * @param {Number} row
     * @param {Number} col
     * @param {String} direction
     * @param {String} eventNameID - Use one of the valid event names from EventsList.js.
     * @param [data] - Any optional data to send with the event.
     */
    emitToPlayersAtViewRange(row, col, direction, eventNameID, data) {
        let currentRow;

        if (direction === Directions.LEFT) {
            // Go to the left column of the view range, then loop down that column from the top of the view range to the bottom.
            for (let rowOffset = -playerViewRange; rowOffset < playerViewRangePlusOne; rowOffset += 1) {

                currentRow = this.grid[row + rowOffset];
                // Check for invalid array index access.
                if (currentRow === undefined) continue;
                if (currentRow[col - playerViewRange] === undefined) continue;

                this.emitToPlayers(currentRow[col - playerViewRange].players, eventNameID, data);
            }
        }
        else if (direction === Directions.RIGHT) {
            // Go to the right column of the view range, then loop down that column from the top of the view range to the bottom.
            for (let rowOffset = -playerViewRange; rowOffset < playerViewRangePlusOne; rowOffset += 1) {

                currentRow = this.grid[row + rowOffset];
                // Check for invalid array index access.
                if (currentRow === undefined) continue;
                if (currentRow[col + playerViewRange] === undefined) continue;

                this.emitToPlayers(currentRow[col + playerViewRange].players, eventNameID, data);
            }
        }
        else if (direction === Directions.UP) {
            // Go to the top row of the view range, then loop along that row from the left of the view range to the right.
            for (let colOffset = -playerViewRange; colOffset < playerViewRangePlusOne; colOffset += 1) {

                currentRow = this.grid[row - playerViewRange];
                // Check for invalid array index access.
                if (currentRow === undefined) continue;
                if (currentRow[col + colOffset] === undefined) continue;

                this.emitToPlayers(currentRow[col + colOffset].players, eventNameID, data);
            }
        }
        else {
            // Go to the bottom row of the view range, then loop along that row from the left of the view range to the right.
            for (let colOffset = -playerViewRange; colOffset < playerViewRangePlusOne; colOffset += 1) {

                currentRow = this.grid[row + playerViewRange];
                // Check for invalid array index access.
                if (currentRow === undefined) continue;
                if (currentRow[col + colOffset] === undefined) continue;

                this.emitToPlayers(currentRow[col + colOffset].players, eventNameID, data);
            }
        }

    }

    /**
     * Converts a row and column offset into a direction.
     * @param {Number} rowOffset
     * @param {Number} colOffset
     * @return {String} The direction of the offset. One of Entity.Directions.
     */
    rowColOffsetToDirection(rowOffset, colOffset) {
        if (rowOffset < 0) return Directions.UP;

        if (rowOffset > 0) return Directions.DOWN;

        if (colOffset < 0) return Directions.LEFT;

        if (colOffset > 0) return Directions.RIGHT;

        if (rowOffset === 0 && colOffset === 0) return Directions.UP;

        Utils.error("A valid offset wasn't given to Board.rowColOffsetToDirection, row: " + rowOffset + ", col: " + colOffset);
    }

    /**
     * Converts a direction into a row and column offset.
     * @param {String} direction
     * @return {Object} The offset of the direction. An object of {row: Number, col: Number}.
     */
    directionToRowColOffset(direction) {
        const offset = {
            row: 0,
            col: 0
        };

        if (direction === Directions.UP) {
            offset.row = -1;
            return offset;
        }
        if (direction === Directions.DOWN) {
            offset.row = 1;
            return offset;
        }
        if (direction === Directions.LEFT) {
            offset.col = -1;
            return offset;
        }
        if (direction === Directions.RIGHT) {
            offset.col = 1;
            return offset;
        }
        Utils.error("A valid direction wasn't given to Board.directionToRowColOffset, direction: " + direction);
    }

    getRowColsToSides(direction, row, col) {
        if (direction === Directions.UP || direction === Directions.DOWN) {
            return [
                { row: row, col: col - 1 },
                { row: row, col: col + 1 }
            ];
        }
        // If it is not up or down, it must be left or right.
        else {
            return [
                { row: row - 1, col: col },
                { row: row + 1, col: col }
            ];
        }
    }

    /**
     * Gets the row and column of the board tile in front of the direction from a given row/col.
     * @param {String} direction
     * @param {Number} row - The row to start from.
     * @param {Number} col - The col to start from.
     * @return {Object} The row and col of the tile in front. An object of {row: Number, col: Number}.
     */
    getRowColInFront(direction, row, col) {
        if (Number.isInteger(row) === false) {
            Utils.error("A valid number wasn't given to Board.getRowColInFront, row: " + row);
        }
        if (Number.isInteger(col) === false) {
            Utils.error("A valid number wasn't given to Board.getRowColInFront, col: " + col);
        }

        const front = {
            row,
            col
        };

        if (direction === Directions.UP) {
            front.row -= 1;
            return front;
        }
        if (direction === Directions.DOWN) {
            front.row += 1;
            return front;
        }
        if (direction === Directions.LEFT) {
            front.col -= 1;
            return front;
        }
        if (direction === Directions.RIGHT) {
            front.col += 1;
            return front;
        }
        Utils.error(" A valid direction wasn't given to Board.getRowColInFront, direction: " + direction);
    }

    /**
     * Gets the row and column of the board tile on the opposite side of a given row/col, from another given row/col.
     * Useful for finding which way to push entities.
     * @param {Number} midRow
     * @param {Number} midCol
     * @param {Number} fromRow
     * @param {Number} fromCol
     * @return {Object} The row and col of the tile opposite the position from. An object of {row: Number, col: Number}.
     */
    getRowColOnOppositeSide(midRow, midCol, fromRow, fromCol) {
        const opposite = {
            row: midRow,
            col: midCol
        };
        // On the same row, so could be a column difference.
        if (fromRow === midRow) {
            opposite.col = midCol + (midCol - fromCol);
        }
        // On the same column, so could be a row difference.
        else if (fromCol === midCol) {
            opposite.col = midRow + (midRow - fromRow);
        }
        return opposite;
    }

    getTileInFront(direction, row, col) {
        const front = this.getRowColInFront(direction, row, col);

        if (this.grid[front.row] === undefined) return false;
        const tile = this.grid[front.row][front.col];
        if (tile === undefined) return false;

        return tile;
    }

    /**
     * Can the target tile be built on by a clan.
     * @param {Number} row
     * @param {Number} col
     * @returns {Boolean} Whether the tile is buildable or not.
     */
    isTileBuildable(row, col) {
        // Check this board is the overworld. Can only build on the overworld.
        if (this !== boardsObject['overworld']) {
            return false;
        }

        // Check there is nothing in the way.
        const grid = this.grid;
        if (grid[row] === undefined) return false;
        /** @type {BoardTile} */
        const boardTile = grid[row][col];
        if (boardTile === undefined) return false;
        // Breakables can be occupied (moved over) if broken, but they should never be able to be built on.
        if (boardTile.static !== null) {
            //console.log("  has a static");
            return false;
        }
        if (boardTile.safeZone === true) {
            //console.log("  is a safe zone");
            return false;
        }
        if (boardTile.groundType.canBeBuiltOn === false) {
            //console.log("  ground type can not be built on");
            return false;
        }
        if (boardTile.containsAnyDestroyables() === true) {
            //console.log("  has a destroyable");
            return false;
        }

        //console.log("  is buildable");

        return true;
    }

}

Board.tileSize = 16;

/**
* Build the client data for a map.
* @param {String} dataFileName
*/
Board.createClientBoardData = (dataFileName) => {
    const mapData = require('../../map/' + dataFileName + '.json');
    const mapProperties = Utils.arrayToObject(mapData.properties, 'name', 'value');

    // Skip disabled maps.
    if (mapProperties['Disabled'] === true) {
        Utils.message("Skipping disabled map:", dataFileName);
        return;
    }

    // Load the map objects.
    // Check that there is some map data for the map of this board.
    if (mapData === undefined) {
        Utils.error("No map data found for this board when creating board:", dataFileName);
        return;
    }

    var i = 0,
        j = 0,
        len = 0,
        layer,
        findLayer = function (layerName) {
            for (var i = 0; i < mapData.layers.length; i += 1) {
                if (mapData.layers[i].name === layerName) {
                    return mapData.layers[i];
                }
            }
            Utils.warning("Couldn't find tilemap layer '" + layerName + "' for board " + this.name + '.');
            return false;
        };

    let clientData = {
        name: dataFileName,
        groundGrid: [],
        staticsGrid: []
    };

    let tilesData;
    let objectsData;
    // A tile layer tile on the tilemap data.
    let mapTile;
    // An object layer tile on the tilemap data.
    let mapObject;
    let relativeID;
    let type;
    let row;
    let col;

    // Initialise an empty grid, with a board tile instance for each column in each row.
    for (i = 0; i < mapData.height; i += 1) {
        // Add the same amount of rows to the map data to write to the clients.
        clientData.groundGrid[i] = [];
        clientData.staticsGrid[i] = [];
    }

    // Check that the ground layer exists in the map data.
    layer = findLayer('Ground');
    if (layer) {
        tilesData = layer.data;
        row = 0;
        col = 0;

        // Add the tiles to the grid.
        for (i = 0, len = tilesData.length; i < len; i += 1) {
            mapTile = tilesData[i] - 1;

            if (groundTileset.tiles[mapTile] === undefined) {
                Utils.error("Invalid/empty map tile found while creating client board data: " + this.name + " at row: " + row + ", col: " + col);
            }
            // Get and separate the type from the prefix using the tile GID.
            type = groundTileset.tiles[mapTile].type;
            // Move to the next row when at the width of the map.
            if (col === mapData.width) {
                col = 0;
                row += 1;
            }
            // Keep the tile number to create the client map data.
            clientData.groundGrid[row][col] = mapTile;
            // Check that the type of this tile is a valid one.
            if (!GroundTypes[type]) {
                Utils.warning("Invalid ground mapTile type: " + type);
            }
            // Move to the next column.
            col += 1;
        }
    }

    class ClientStaticTile extends Array {
        /**
         * A standard format to use for each cell in the statics grid client data.
         * Each cell that the client expects should be of [tileID, data], where tileID
         * is the ID of the tile on the texture to render, and data is any other
         * optional config that the client tile might expect.
         * @param {Number} row 
         * @param {Number} col 
         * @param {Number} tileID 
         * @param {*} [data]
         */
        constructor(row, col, tileID, data) {
            super();
            this.push(tileID);
            if (data !== undefined) this.push(data);

            // Add the tile data to the client map data to save.
            clientData.staticsGrid[row][col] = this;
        }
    }

    // Check that the statics layer exists in the map data.
    layer = findLayer('Statics');
    if (layer) {
        tilesData = layer.data;
        row = 0;
        col = 0;

        // Add the tiles to the grid.
        for (i = 0, len = tilesData.length; i < len; i += 1) {
            mapTile = tilesData[i] - 1;

            // Move to the next row when at the width of the map.
            if (col === mapData.width) {
                col = 0;
                row += 1;
            }

            // Get the ID of the tile relative to the tileset it belongs to.
            relativeID = mapTile - staticsStartGID;

            // Relative IDs lower than 0 are for empty grid spaces.
            if (relativeID < 0) {
                new ClientStaticTile(row, col, 0);
                // Still need to move the column along.
                col += 1;
                // Skip this tile.
                continue;
            }

            // Skip empty tiles.
            if (mapTile < 0) {
                // Still need to move the column along.
                col += 1;
                continue;
            }

            // A tile might have been placed on the map, but not have a type set.
            // All entities need to be created from a type.
            // Check a type is set.
            if (staticsTileset.tiles[relativeID] === undefined) {
                // Keep the tile number to create the client map data.
                new ClientStaticTile(row, col, relativeID);
                // Still need to move the column along.
                col += 1;
                // Skip this tile.
                continue;
            }
            // A type is set. Create an entity.

            // Get and separate the type from the prefix using the tile GID.
            type = staticsTileset.tiles[relativeID].type;

            // If it is a crafting station, add the type number to the data so the client knows what kind of station this is.
            if (EntitiesList[type] && EntitiesList[type].prototype instanceof EntitiesList.CraftingStation) {
                new ClientStaticTile(row, col, relativeID, EntitiesList[type].prototype.typeNumber);
            }
            else {
                // Still need to put something in the statics data for the client.
                new ClientStaticTile(row, col, relativeID);
            }
            // Move to the next column.
            col += 1;
        }
    }

    // Check that the configurables layer exists in the map data.
    layer = findLayer('Configurables');
    if (layer) {
        // This is a object layer, not a tile one, so get the objects data.
        objectsData = layer.objects;

        // Add the entities to the world.
        for (i = 0, len = objectsData.length; i < len; i += 1) {
            mapObject = objectsData[i];

            // If this entity is a text object, skip it.
            if (mapObject.text !== undefined) {
                continue;
            }

            // Reset this in case an invalid type was found below, otherwise this would still be the previous valid type.
            type = null;

            // Convert the object position in Tiled into a row and column.
            col = mapObject.x / Board.tileSize;
            row = (mapObject.y / Board.tileSize) - (mapObject.height / Board.tileSize);

            // The ID of this tile on the statics tileset.
            const objectID = mapObject.gid - staticsStartGID - 1;

            // Get and separate the type from the prefix using the tile GID.
            type = staticsTileset.tiles[objectID].type;

            // Check that the type of this tile is a valid one.
            if (EntitiesList[type]) {
                const config = {};

                if (mapObject.properties['Disabled']) {
                    Utils.warning("Map object is disabled in map data:", mapObject);
                    continue;
                }

                switch (type) {
                    case 'DungeonPortal':
                        // Check the dungeon portal properties are valid.
                        if (mapObject.properties === undefined) {
                            Utils.error("No properties set on dungeon portal in map data:", mapObject);
                            continue;
                        }
                        config.dungeonName = mapObject.properties['DungeonName'];
                        break;
                }

                // Create a new entity of the type of this tile.
                const EntityType = EntitiesList[type];

                // If this configurable is meant to be seen on the client, create the data to store in the client map data.
                // This can have additional data added to it with .push().

                // If a dungeon portal, add the dungeon ID to the data.
                if (EntityType === EntitiesList.DungeonPortal) {
                    // Get the ID of the dungeon manager this dungeon portal links to.
                    new ClientStaticTile(row, col, objectID, DungeonManagersList.ByName["dungeon-" + config.dungeonName].id);
                }
                // If a overworld portal, just add the tile ID.
                if (EntityType === EntitiesList.OverworldPortal) {
                    new ClientStaticTile(row, col, objectID);
                }

            }
            else {
                // If a GUI trigger, just write the data to the client. No server entity needed.
                if (type === 'GUITrigger') {
                    // Add it to all of the slots this object covers.
                    const objectRows = mapObject.height / Board.tileSize;
                    const objectCols = mapObject.width / Board.tileSize;
                    for (let rowOffset = 0; rowOffset < objectRows; rowOffset += 1) {
                        for (let colOffset = 0; colOffset < objectCols; colOffset += 1) {
                            new ClientStaticTile(row + rowOffset, col + colOffset, objectID, {
                                name: mapObject.properties['Name'],
                                panelName: mapObject.properties['PanelName'],
                                panelNameTextDefID: mapObject.properties['PanelNameTextDefID'],
                                contentFileName: mapObject.properties['ContentFileName'],
                                contentTextDefID: mapObject.properties['ContentTextDefID'],
                            });
                        }
                    }
                }
                else {
                    //Utils.warning("Entity type doesn't exist for configurable object type: " + type);
                }
            }
        }
    }

    // Save the client map data that was extracted.
    const json = JSON.stringify(clientData);

    //console.log("client data to save:", json);

    Utils.checkDirectoryExists('../client/assets/map');

    // Write the data to the file in the client files.
    fs.writeFileSync("../client/assets/map/" + dataFileName + ".json", json, "utf8");

    Utils.message("Map data written to client: " + dataFileName);
};

module.exports = Board;

const boardsObject = require('./BoardsList').boardsObject;
const DungeonManagersList = require('../dungeon/DungeonManagersList');