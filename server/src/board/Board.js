const fs = require("fs");
const Utils = require("../Utils");
const GroundTypes = require("./GroundTypes");
const groundTileset = require("../../map/tilesets/ground");
const boundariesTileset = require("../../map/tilesets/boundaries");
const staticsTileset = require("../../map/tilesets/statics");
const BoardTile = require("./BoardTile");
const EntitiesList = require("../entities/EntitiesList");
const DayPhases = require("../DayPhases");
const settings = require("../../settings");
const { boardsObject } = require("./BoardsList");
const DungeonManagersList = require("../dungeon/DungeonManagersList");
const { Directions, OppositeDirections, RowColOffsetsByDirection } = require("../gameplay/Directions");

// A recent version of Tiled may have changed the tileset.tiles property to be an array of {id: Number, type: String}
// Map the values back to an object by ID.
groundTileset.tiles = groundTileset.tiles.reduce((map, obj) => {
    map[obj.id] = obj;
    return map;
}, {});

boundariesTileset.tiles = boundariesTileset.tiles.reduce((map, obj) => {
    map[obj.id] = obj;
    return map;
}, {});

staticsTileset.tiles = staticsTileset.tiles.reduce((map, obj) => {
    map[obj.id] = obj;
    return map;
}, {});

const playerViewRange = EntitiesList.Player.viewRange;
// Need this so that the loops in the functions that emit to players around the player view range go all the way to
// the end of the bottom row and right column, otherwise the actual emit area will be the player view range - 1.
// Precomputed value to avoid having to do `i <= playerViewRange` (2 checks), or `i < playerViewRange + 1` (repeated calculation).
const playerViewRangePlusOne = playerViewRange + 1;

// Sum the amount of tiles in each previous tileset to get the start GID of each tileset.
const boundariesStartGID = groundTileset.tilecount;
const staticsStartGID = groundTileset.tilecount + boundariesTileset.tilecount;

const idCounter = new Utils.Counter();

const destroyablesString = "destroyables";
const playersString = "players";
const pickupsString = "pickups";

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
        this.name = name || "Unnamed board";

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
        const { mapData } = this;

        this.rows = this.mapData.height;
        this.cols = this.mapData.width;

        // Load the map objects.
        // Check that there is some map data for the map of this board.
        if (mapData === undefined) {
            Utils.error(`No map data found for this board when creating board ${this.name}`);
            return;
        }

        let i = 0;
        let j = 0;
        let len = 0;
        let layer;
        const findLayer = (layerName) => {
            const foundLayer = mapData.layers.find((eachLayer) => eachLayer.name === layerName);

            if (foundLayer) return foundLayer;

            Utils.warning(`Couldn't find tilemap layer '${layerName}' for board ${this.name}.`);
            return false;
        };

        let tilesData;
        let objectsData;
        // A tile layer tile on the tilemap data.
        let mapTile;
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
        layer = findLayer("Boundaries");
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
                    if (type === "SafeZone") {
                        // Make this tile a safe zone.
                        this.grid[row][col].safeZone = true;
                    }
                }

                // Move to the next column.
                col += 1;
            }
        }

        // Check that the ground layer exists in the map data.
        layer = findLayer("Ground");
        if (layer) {
            tilesData = layer.data;
            row = 0;
            col = 0;

            // Add the tiles to the grid.
            for (i = 0, len = tilesData.length; i < len; i += 1) {
                mapTile = tilesData[i] - 1;

                if (groundTileset.tiles[mapTile] === undefined) {
                    Utils.error(`Invalid/empty map tile found while creating board: ${this.name} at row: ${row}, col: ${col}`);
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
                    Utils.warning(`Invalid ground mapTile type: ${type}`);
                }
                // Move to the next column.
                col += 1;
            }
        }

        // Check that the statics layer exists in the map data.
        layer = findLayer("Statics");
        if (layer) {
            tilesData = layer.data;
            row = 0;
            col = 0;

            // Add the tiles to the grid.
            tilesData.forEach((skip, index) => {
                mapTile = tilesData[index] - 1;

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
                    return;
                }

                // Skip empty tiles.
                if (mapTile < 0) {
                    // Still need to move the column along.
                    col += 1;
                    // Skip this tile.
                    return;
                }

                // A tile might have been placed on the map, but not have a type set.
                // All entities need to be created from a type.
                // Check a type is set.
                if (staticsTileset.tiles[relativeID] === undefined) {
                    // Still need to move the column along.
                    col += 1;
                    // Skip this tile.
                    return;
                }
                // A type is set. Create an entity.

                // Get and separate the type from the prefix using the tile GID.
                type = staticsTileset.tiles[relativeID].type;

                // Check that the type of this tile is a valid one.
                if (EntitiesList[type]) {
                    // Create a new entity of the type of this tile.
                    new EntitiesList[type]({ row, col, board: this });
                }
                else {
                    // Utils.warning("Entity type doesn't exist for static mapTile type: " + type);
                }
                // Move to the next column.
                col += 1;
            });
        }

        // Check that the configurables layer exists in the map data.
        layer = findLayer("Configurables");
        if (layer) {
            // This is a object layer, not a tile one, so get the objects data.
            objectsData = layer.objects;

            // Add the entities to the world.
            // An object layer tile on the tilemap data.
            objectsData.forEach((mapObject) => {
                // If this entity is a text object, skip it.
                if (mapObject.text !== undefined) {
                    return;
                }

                // Reset this in case an invalid type was found below, otherwise this would still be the previous valid type.
                type = null;

                // Convert the object position in Tiled into a row and column.
                col = mapObject.x / this.tileSize;
                row = (mapObject.y / this.tileSize) - (mapObject.height / this.tileSize);

                // The ID of this tile on the statics tileset.
                const objectID = mapObject.gid - staticsStartGID - 1;

                if (!staticsTileset.tiles[objectID]) return;

                // Get and separate the type from the prefix using the tile GID.
                type = staticsTileset.tiles[objectID].type;

                // Check that the type of this entity is a valid one.
                if (EntitiesList[type]) {
                    const config = {
                        row,
                        col,
                        board: this,
                    };

                    // Check if the properties are already an array, as the map data object might have already
                    // been passed through createBoard and each of the properties converted to an object, such
                    // as another dungeon instance board being made from the same map data.
                    // TODO: do this on all map objects in the all map datas beforehand, so it isnt done every time a board instance is made.
                    if (Array.isArray(mapObject.properties)) {
                        mapObject.properties = Utils.arrayToObject(mapObject.properties, "name", "value");
                    }

                    const mapObjProps = mapObject.properties;

                    if (!mapObjProps) {
                        // All map objects should have some properties of how they are configured.
                        Utils.warning("Map object in map data without any properties:", mapObject);
                        return;
                    }

                    if (mapObjProps.Disabled) {
                        Utils.warning("Map object is disabled in map data:", mapObject);
                        return;
                    }

                    if (mapObjProps.DevOnly && !settings.DEV_MODE) {
                        Utils.warning("Map object is only for development. Skipping:", mapObject);
                        return;
                    }

                    switch (type) {
                    case "SpawnerArea": {
                        // Check if spawners have been disabled in the settings.
                        if (settings.DISABLE_SPAWNER_AREAS) return;

                        config.width = mapObject.width / this.tileSize;
                        config.height = mapObject.height / this.tileSize;
                        config.EntityType = EntitiesList[mapObjProps.EntityTypeName];
                        // Check the entity type to create is valid.
                        if (!config.EntityType) {
                            Utils.warning(`Invalid spawner configuration. Entity type to spawn doesn't exist: ${mapObjProps.EntityTypeName}. Skipping.`);
                            return;
                        }
                        config.maxAtOnce = mapObjProps.MaxAtOnce;
                        config.spawnRate = mapObjProps.SpawnRate;
                        config.testing = mapObjProps.Testing;

                        const isPickup = (config.EntityType.prototype
                            instanceof EntitiesList.AbstractClasses.Pickup);

                        // Check the item config properties are only added to a pickup spawner.
                        if (
                            mapObjProps.ItemQuantity
                            || mapObjProps.ItemDurability
                        ) {
                            if (!isPickup) {
                                Utils.warning("Messy spawner configuration. Item config property found on a non-pickup spawner. Only pickup spawners should have item config properties. Map object:", mapObject);
                            }

                            if (mapObjProps.ItemQuantity && mapObjProps.ItemDurability) {
                                Utils.error("Invalid spawner configuration. Pickup spawners cannot have both `ItemQuantity` and `ItemDurability` properties. Map object:", mapObject);
                            }

                            // Need to create the item config new each time a pickup is spawned, or different
                            // pickups will share the same config which can be mutated, so don't use an actual
                            // instance of ItemConfig, just pass the props along and the spawner will take
                            // care of making the ItemConfig instances.
                            config.itemConfig = {
                                ItemType: config.EntityType.prototype.ItemType,
                                quantity: mapObjProps.ItemQuantity,
                                durability: mapObjProps.ItemDurability,
                            };
                        }

                        // Make sure that a item config prop is still given, even if there are no
                        // custom item config properties on the map object.
                        if (isPickup && !config.itemConfig) {
                            config.itemConfig = {
                                ItemType: config.EntityType.prototype.ItemType,
                            };
                        }

                        // Check the dungeon key properties are only added to a mob spawner.
                        if (mapObjProps.RedKeys
                            || mapObjProps.GreenKeys
                            || mapObjProps.BlueKeys
                            || mapObjProps.YellowKeys
                            || mapObjProps.BrownKeys
                        ) {
                            const isMob = (config.EntityType.prototype
                                instanceof EntitiesList.AbstractClasses.Mob);

                            if (!isMob) {
                                Utils.warning("Messy spawner configuration. Dungeon keys property found on a non-mob spawner. Only mob spawners should have dungeon keys properties. Map object:", mapObject);
                            }

                            config.dungeonKeys = {};
                            const { dungeonKeys } = config;
                            if (mapObjProps.RedKeys) dungeonKeys.red = mapObjProps.RedKeys;
                            if (mapObjProps.GreenKeys) dungeonKeys.green = mapObjProps.GreenKeys;
                            if (mapObjProps.BlueKeys) dungeonKeys.blue = mapObjProps.BlueKeys;
                            if (mapObjProps.YellowKeys) dungeonKeys.yellow = mapObjProps.YellowKeys;
                            if (mapObjProps.BrownKeys) dungeonKeys.brown = mapObjProps.BrownKeys;
                        }
                        break;
                    }
                    case "ProjectileEmitter": {
                        config.ProjectileType = EntitiesList[`Proj${mapObjProps.ProjectileTypeName}`];
                        // Check the entity type to create is valid.
                        if (!config.ProjectileType) {
                            Utils.warning(`Invalid projectile emitter configuration. Entity type to spawn doesn't exist: ${mapObjProps.ProjectileTypeName}. Skipping.`);
                            return;
                        }

                        config.spawnRate = mapObjProps.SpawnRate;
                        config.range = mapObjProps.Range;
                        config.delay = mapObjProps.Delay;

                        config.direction = Directions[mapObjProps.Direction.toUpperCase()];
                        if (!config.direction) {
                            Utils.warning(`Invalid projectile emitter configuration. Invalid direction: ${mapObjProps.Direction}. Skipping.`);
                        }

                        break;
                    }
                    case "Exit": {
                        config.targetBoard = mapObjProps.TargetBoard;
                        config.targetEntranceName = mapObjProps.TargetEntranceName;
                        break;
                    }
                    case "DungeonPortal": {
                        // Check the dungeon portal properties are valid.
                        if (mapObjProps === undefined) {
                            Utils.error("No properties set on dungeon portal in map data:", mapObject);
                            return;
                        }
                        config.dungeonName = mapObjProps.DungeonName;
                        if (config.dungeonName === undefined) {
                            Utils.error(`Dungeon portal on map "${this.name}" is missing property "DungeonName". Map object:`, mapObject);
                            return;
                        }

                        // Check the dungeon manager to link to exists.
                        if (!DungeonManagersList.ByName[`dungeon-${config.dungeonName}`]) {
                            Utils.warning("Cannot create dungeon portal entity, the target dungeon manager is not in the dungeon managers list. Dungeon name:", config.dungeonName);
                            return;
                        }

                        break;
                    }
                    case "OverworldPortal": {
                        config.targetBoard = mapObjProps.TargetBoard;
                        config.targetEntranceName = mapObjProps.TargetEntranceName;
                        config.activeState = mapObjProps.ActiveState;
                        break;
                    }
                    case "Entrance": {
                        config.width = mapObject.width / this.tileSize;
                        config.height = mapObject.height / this.tileSize;
                        config.entranceName = mapObjProps.EntranceName;
                        if (config.entranceName === "dungeon-start") {
                            dungeonStartEntranceFound = true;
                        }
                        break;
                    }
                    default:
                        // No default.
                    }

                    // Create a new entity of the type of this tile.
                    new EntitiesList[type](config);
                }
                else {
                    // Utils.warning("Entity type doesn't exist for configurable object type: " + type);
                }
            });
        }

        // Dungeon maps must have an entrance named "dungeon-start".
        if (this.dungeon) {
            if (dungeonStartEntranceFound === false) Utils.error("Dungeon map does not have an entrance named \"dungeon-start\". Map name:", this.name);
        }

        // No longer need the map data.
        this.mapData = undefined;
    }

    destroy() {
        // Need to remove all references from the board to the entity,
        // and also the entity to the board (done in Entity.onDestroy.

        // Destroy all current entities on the board.
        this.grid.forEach((row) => {
            row.forEach((boardTile) => {
                // Not all tiles might have a static on them.
                if (boardTile.static) {
                    boardTile.static.destroy();
                }

                Object.values(boardTile.destroyables)
                    .forEach((destroyable) => destroyable.destroy());
            });
        });

        this.entrances = null;

        Object.values(this.spawners).forEach((spawner) => spawner.destroy());

        this.spawners = null;
    }

    /**
     * @param {Destroyable} entity
     */
    addDestroyable(entity) {
        const tile = this.grid[entity.row][entity.col];
        if (Object.prototype.hasOwnProperty.call(tile, destroyablesString)) {
            tile.destroyables[entity.id] = entity;
        }
        else {
            tile.destroyables = {};

            tile.destroyables[entity.id] = entity;
        }
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
        const tile = this.grid[player.row][player.col];
        if (Object.prototype.hasOwnProperty.call(tile, playersString)) {
            tile.players[player.id] = player;
        }
        else {
            tile.players = {};

            tile.players[player.id] = player;
        }
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
        this.grid[entity.row][entity.col].static = null;
    }

    /**
     * @param {Pickup} entity
     */
    addPickup(entity) {
        const tile = this.grid[entity.row][entity.col];
        if (Object.prototype.hasOwnProperty.call(tile, pickupsString)) {
            tile.pickups[entity.id] = entity;
        }
        else {
            tile.pickups = {};

            tile.pickups[entity.id] = entity;
        }
    }

    /**
     * @param {Pickup} entity
     */
    removePickup(entity) {
        delete this.grid[entity.row][entity.col].pickups[entity.id];
    }

    /**
     * @param {Destroyable} entity
     * @param {Number} range
     * @returns {Array}  Returns array of tiles within range surrounding entity
     */
    getTilesInEntityRange(entity, range) {
        return this.getTilesInRange(entity.row, entity.col, range);
    }

    /**
     * @param {Number} row The row of the target tile.
     * @param {Number} col The col of the target tile.
     * @param {Number} range How far away to get tiles within.
     * @returns {Array} Returns array of tiles within range.
     */
    getTilesInRange(row, col, range) {
        range = range || 1;
        range = Math.abs(Number.parseInt(range, 10));

        if (range <= 0) {
            return [];
        }

        const rangePlusOne = range + 1;
        const tiles = [];
        let rowOffset;
        let colOffset;
        let boardTile;

        for (rowOffset = -range; rowOffset < rangePlusOne; rowOffset += 1) {
            for (colOffset = -range; colOffset < rangePlusOne; colOffset += 1) {
                // Check row is valid.
                if (this.grid[row + rowOffset] !== undefined) {
                    boardTile = this.grid[row + rowOffset][col + colOffset];
                    // Check col is valid.
                    if (boardTile !== undefined) tiles.push(boardTile);
                }
            }
        }
        return tiles;
    }

    getTilePositionsInRange(row, col, range) {
        range = range || 1;

        if (range < 1) {
            return [];
        }

        const rangePlusOne = range + 1;
        const tiles = [];
        let rowOffset;
        let colOffset;
        let boardTile;

        for (rowOffset = -range; rowOffset < rangePlusOne; rowOffset += 1) {
            for (colOffset = -range; colOffset < rangePlusOne; colOffset += 1) {
                // Check row is valid.
                if (this.grid[row + rowOffset] !== undefined) {
                    boardTile = this.grid[row + rowOffset][col + colOffset];
                    // Check col is valid.
                    if (boardTile !== undefined) {
                        tiles.push({
                            row: row + rowOffset,
                            col: col + colOffset,
                        });
                    }
                }
            }
        }
        return tiles;
    }

    /**
     * Get all of the destroyables (and any interactables that are not in their default state) that are within the player view range of the target position.
     * @param {Number} row
     * @param {Number} col
     * @returns {Array} Returns an array containing the entities found.
     */
    getNearbyDynamicsData(row, col) {
        /** @type {Array} */
        const nearbyDynamics = [];

        // How far around the target position to get data from.
        /** @type {Number} */
        let rowOffset = -playerViewRange;
        let colOffset = -playerViewRange;
        let currentRow;
        /** @type {BoardTile} */
        let currentTile;
        /** @type {Object} */
        let destroyables;
        /** @type {Interactable} */
        let interactable;

        for (; rowOffset < playerViewRangePlusOne; rowOffset += 1) {
            for (colOffset = -playerViewRange; colOffset < playerViewRangePlusOne; colOffset += 1) {
                currentRow = this.grid[row + rowOffset];
                // Check for invalid array index access.
                // eslint-disable-next-line no-continue
                if (!currentRow) continue;
                currentTile = currentRow[col + colOffset];
                // eslint-disable-next-line no-continue
                if (!currentTile) continue;

                destroyables = currentTile.destroyables;

                // Get all of the destroyable entities on this board tile.
                Object.values(destroyables).forEach((destroyable) => {
                    // Add the relevant data of this entity to the data to return.
                    nearbyDynamics.push(
                        destroyable.getEmittableProperties({}),
                    );
                });

                // Now get the state of the interactable if it isn't in its default state.
                interactable = currentTile.static;
                // Check there is actually one there.
                if (interactable) {
                    // Check if it is not in its default state. If not, add it to the data.
                    // Also checks if it is actually an interactable.
                    if (interactable.activeState === false) {
                        // Add the relevant data of this entity to the data to return.
                        nearbyDynamics.push(
                            interactable.getEmittableProperties({}),
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
     * @returns {Array|Boolean} Returns an array containing the entities found, or false if none found.
     */
    getDynamicsAtViewRangeData(row, col, direction) {
        /** @type {Array} */
        const edgeDynamics = [];

        /** @type {BoardTile} */
        let currentTile;

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
     * @param {Number} row
     * @param {Number} col
     * @param {Number} range
     * @returns {Array} An array of Player entities.
     */
    getNearbyPlayers(row, col, range) {
        const nearbyPlayers = [];
        const { grid } = this;
        const rangePlusOne = range + 1;

        let rowOffset = -range;
        let colOffset = -range;
        let targetRow;
        let targetCol;

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
     * @param {Number} row
     * @param {Number} col
     * @param {String} eventNameID - Use one of the valid event names from EventsList.js.
     * @param {*} [data] - Any optional data to send with the event.
     * @param {Number} [range=playerViewRangePlusOne] - A specific range to define "nearby" to be, otherwise uses the player view range + 1.
     */
    emitToNearbyPlayers(row, col, eventNameID, data, range) {
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

                this.emitToPlayers(players, eventNameID, data);
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
        // Find all of the player entities on this board tile.
        Object.values(players).forEach((player) => {
            const { socket } = player;
            // Make sure this socket connection is in a ready state. Might have just closed or be closing.
            if (socket.readyState === 1) {
                socket.sendEvent(eventNameID, data);
            }
        });
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

                this.emitToPlayers(tile.players, eventNameID, data);
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

                this.emitToPlayers(tile.players, eventNameID, data);
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

                this.emitToPlayers(tile.players, eventNameID, data);
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

                this.emitToPlayers(tile.players, eventNameID, data);
            }
        }
    }

    /**
     * Gets the row and column of the board tile in front of the direction from a given row/col.
     * @param {String} direction
     * @param {Number} row - The row to start from.
     * @param {Number} col - The col to start from.
     * @returns {Object} The row and col of the tile in front. An object of {row: Number, col: Number}.
     */
    getRowColInFront(direction, row, col) {
        if (Number.isInteger(row) === false) {
            Utils.error(`A valid number wasn't given to Board.getRowColInFront, row: ${row}`);
        }
        if (Number.isInteger(col) === false) {
            Utils.error(`A valid number wasn't given to Board.getRowColInFront, col: ${col}`);
        }

        const offset = RowColOffsetsByDirection[direction];

        if (!offset) {
            Utils.error(` A valid direction wasn't given to Board.getRowColInFront, direction: ${direction}`);
        }

        // Apply the offset to the given position and return it.
        return {
            row: row + offset.row,
            col: col + offset.col,
        };
    }

    /**
     * Gets the row and column of the board tile on the opposite side of a given row/col, from another given row/col.
     * Useful for finding which way to push entities.
     * @param {Number} midRow
     * @param {Number} midCol
     * @param {Number} fromRow
     * @param {Number} fromCol
     * @returns {Object} The row and col of the tile opposite the position from. An object of {row: Number, col: Number}.
     */
    getRowColOnOppositeSide(midRow, midCol, fromRow, fromCol) {
        const opposite = {
            row: midRow,
            col: midCol,
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

    /**
     * Gets the tile on this board at the given position.
     * Returns false if the position is invalid.
     * @param {Number} row
     * @param {Number} col
     * @returns {BoardTile}
     */
    getTileAt(row, col) {
        // TODO: replace cases of ...board.grid[row][col] manaual tile validity checks with this method.
        if (this.grid[row] === undefined) return false;
        const tile = this.grid[row][col];
        // Check the grid col element (the tile itself) being accessed is valid.
        if (tile === undefined) return false;
        return tile;
    }

    /**
     * Gets the tile on this board in front of the given position.
     * Returns false if the position is invalid.
     * @param {String} direction
     * @param {Number} row
     * @param {Number} col
     * @returns {BoardTile}
     */
    getTileInFront(direction, row, col) {
        const front = this.getRowColInFront(direction, row, col);

        return this.getTileAt(front.row, front.col) || false;
    }

    /**
     * Gets the tile on this board behind (other side from direction) of the given position.
     * Returns false if the position is invalid.
     * @param {String} direction
     * @param {Number} row
     * @param {Number} col
     */
    getTileBehind(direction, row, col) {
        const behind = this.getRowColInFront(OppositeDirections[direction], row, col);

        return this.getTileAt(behind.row, behind.col) || false;
    }

    /**
     * Can the target tile be built on by a clan.
     * @param {Number} row
     * @param {Number} col
     * @returns {Boolean} Whether the tile is buildable or not.
     */
    isTileBuildable(row, col) {
        // Check this board is the overworld. Can only build on the overworld.
        if (this !== boardsObject.overworld) {
            return false;
        }

        // Check there is nothing in the way.
        const { grid } = this;
        if (grid[row] === undefined) return false;
        /** @type {BoardTile} */
        const boardTile = grid[row][col];
        if (boardTile === undefined) return false;

        return boardTile.isBuildable();
    }
}

Board.tileSize = 16;

/**
* Build the client data for a map.
* @param {String} dataFileName
*/
Board.createClientBoardData = (dataFileName) => {
    // eslint-disable-next-line global-require
    const mapData = require(`../../map/${dataFileName}.json`);
    const mapProperties = Utils.arrayToObject(mapData.properties, "name", "value");

    // Skip disabled maps.
    if (mapProperties.Disabled === true) {
        Utils.message("Skipping disabled map:", dataFileName);
        return;
    }

    // Load the map objects.
    // Check that there is some map data for the map of this board.
    if (mapData === undefined) {
        Utils.error("No map data found for this board when creating board:", dataFileName);
        return;
    }

    let i = 0;
    let len = 0;
    let layer;

    const findLayer = (layerName) => {
        const foundLayer = mapData.layers.find((eachLayer) => eachLayer.name === layerName);

        if (foundLayer) return foundLayer;

        Utils.warning(`Couldn't find tilemap layer '${layerName}' for board ${this.name}.`);
        return false;
    };

    const clientData = {
        name: dataFileName,
        groundGrid: [],
        staticsGrid: [],
        musicZones: {},
    };

    let tilesData;
    let objectsData;
    // A tile layer tile on the tilemap data.
    let mapTile;
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
    layer = findLayer("Ground");
    if (layer) {
        tilesData = layer.data;
        row = 0;
        col = 0;

        // Add the tiles to the grid.
        for (i = 0, len = tilesData.length; i < len; i += 1) {
            mapTile = tilesData[i] - 1;

            if (groundTileset.tiles[mapTile] === undefined) {
                Utils.error(`Invalid/empty map tile found while creating client board data: ${dataFileName} at row: ${row}, col: ${col}`);
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
                Utils.warning(`Invalid ground mapTile type: ${type}`);
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
        constructor(tileRow, tileCol, tileID, data) {
            super();
            this.push(tileID);
            if (data !== undefined) this.push(data);

            // Add the tile data to the client map data to save.
            clientData.staticsGrid[tileRow][tileCol] = this;
        }
    }

    // Check that the statics layer exists in the map data.
    layer = findLayer("Statics");
    if (layer) {
        tilesData = layer.data;
        row = 0;
        col = 0;

        // Add the tiles to the grid.
        tilesData.forEach((skip, index) => {
            mapTile = tilesData[index] - 1;

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
                return;
            }

            // Skip empty tiles.
            if (mapTile < 0) {
                // Still need to move the column along.
                col += 1;
                return;
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
                return;
            }
            // A type is set. Create an entity.

            // Get and separate the type from the prefix using the tile GID.
            type = staticsTileset.tiles[relativeID].type;

            // If it is a crafting station, add the type number to the data so the client knows what kind of station this is.
            if (
                EntitiesList[type]
                && EntitiesList[type].prototype instanceof EntitiesList.CraftingStation
            ) {
                new ClientStaticTile(row, col, relativeID, EntitiesList[type].prototype.typeNumber);
            }
            else {
                // Still need to put something in the statics data for the client.
                new ClientStaticTile(row, col, relativeID);
            }
            // Move to the next column.
            col += 1;
        });
    }

    // Check that the configurables layer exists in the map data.
    layer = findLayer("Configurables");
    if (layer) {
        // This is a object layer, not a tile one, so get the objects data.
        objectsData = layer.objects;

        // Add the entities to the world.
        objectsData.forEach((mapObject) => {
            // If this entity is a text object, skip it.
            if (mapObject.text !== undefined) return;

            // Don't add dev only map objects to the client data when not in dev mode.
            if (mapObject.properties.DevOnly && !settings.DEV_MODE) return;

            // Reset this in case an invalid type was found below, otherwise this would still be the previous valid type.
            type = null;

            // Convert the object position in Tiled into a row and column.
            col = mapObject.x / Board.tileSize;
            row = (mapObject.y / Board.tileSize) - (mapObject.height / Board.tileSize);

            // The ID of this tile on the statics tileset.
            const objectID = mapObject.gid - staticsStartGID - 1;

            if (!staticsTileset.tiles[objectID]) return;

            // Get and separate the type from the prefix using the tile GID.
            type = staticsTileset.tiles[objectID].type;

            // Check that the type of this tile is a valid one.
            if (EntitiesList[type]) {
                const config = {};

                if (mapObject.properties) {
                    if (mapObject.properties.Disabled) {
                        Utils.warning("Map object is disabled in map data:", mapObject);
                        return;
                    }
                }

                switch (type) {
                case "DungeonPortal":
                    // Check the dungeon portal properties are valid.
                    if (mapObject.properties === undefined) {
                        Utils.error("No properties set on dungeon portal in map data:", mapObject);
                        return;
                    }

                    config.dungeonName = mapObject.properties.DungeonName;

                    // Check the dungeon manager to link to exists.
                    if (!DungeonManagersList.ByName[`dungeon-${config.dungeonName}`]) {
                        Utils.warning("Cannot create dungeon portal entity, the target dungeon manager is not in the dungeon managers list. Dungeon name:", config.dungeonName);
                        return;
                    }

                    break;

                default:
                    // No default.
                }

                // Create a new entity of the type of this tile.
                const EntityType = EntitiesList[type];

                // If this configurable is meant to be seen on the client, create the data to store in the client map data.
                // This can have additional data added to it with .push().

                // If a dungeon portal, add the dungeon ID to the data.
                if (EntityType === EntitiesList.DungeonPortal) {
                    // Get the ID of the dungeon manager this dungeon portal links to.
                    new ClientStaticTile(row, col, objectID, DungeonManagersList.ByName[`dungeon-${config.dungeonName}`].id);
                }
                // If a overworld portal, just add the tile ID.
                if (EntityType === EntitiesList.OverworldPortal) {
                    new ClientStaticTile(row, col, objectID);
                }
            }
            // If a GUI trigger, just write the data to the client. No server entity needed.
            // else if (type === "GUITrigger") {
            //     // Add it to all of the slots this object covers.
            //     const objectRows = mapObject.height / Board.tileSize;
            //     const objectCols = mapObject.width / Board.tileSize;
            //     for (let rowOffset = 0; rowOffset < objectRows; rowOffset += 1) {
            //         for (let colOffset = 0; colOffset < objectCols; colOffset += 1) {
            //             new ClientStaticTile(row + rowOffset, col + colOffset, objectID, {
            //                 name: mapObject.properties.Name,
            //                 panelName: mapObject.properties.PanelName,
            //                 panelNameTextDefID: mapObject.properties.PanelNameTextDefID,
            //                 contentFileName: mapObject.properties.ContentFileName,
            //                 contentTextDefID: mapObject.properties.ContentTextDefID,
            //             });
            //         }
            //     }
            // }
            else {
                // Utils.warning("Entity type doesn't exist for configurable object type: " + type);
            }
        });
    }

    // Check that the music zones layer exists in the map data.
    layer = findLayer("MusicZones");
    if (layer) {
        // This is a object layer, not a tile one, so get the objects data.
        objectsData = layer.objects;

        // Add the entities to the world.
        objectsData.forEach((mapObject) => {
            // console.log("music mapobject:", mapObject);

            if (mapObject.type !== "MusicZone") {
                Utils.warning("Map object on 'MusicZones' layer is not of type 'MusicZone'. Skipping:", mapObject);
                return;
            }

            // Convert the object position in Tiled into a row and column.
            col = mapObject.x / Board.tileSize;
            row = mapObject.y / Board.tileSize;
            const objectRows = mapObject.height / Board.tileSize;
            const objectCols = mapObject.width / Board.tileSize;

            const objProperties = Utils.arrayToObject(mapObject.properties, "name", "value");

            // Add it to all of the tiles this object covers.
            for (let rowOffset = 0; rowOffset < objectRows; rowOffset += 1) {
                for (let colOffset = 0; colOffset < objectCols; colOffset += 1) {
                    clientData.musicZones[`${row + rowOffset}-${col + colOffset}`] = objProperties.AudioFileName;
                }
            }
        });
    }

    // Save the client map data that was extracted.
    const json = JSON.stringify(clientData);

    // console.log("client data to save:", json);

    Utils.checkDirectoryExists("../client/src/assets/maps");

    // Write the data to the file in the client files.
    fs.writeFileSync(`../client/src/assets/maps/${dataFileName}.json`, json, "utf8");

    Utils.message(`Map data written to client: ${dataFileName}`);
};

module.exports = Board;
