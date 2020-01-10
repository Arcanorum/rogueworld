
const fs =                      require('fs');
const Utils =                   require('./Utils');
const GroundTypes =             require('./GroundTypes');
const groundTileset =           require('./../map/tilesets/ground');
const boundariesTileset =       require('./../map/tilesets/boundaries');
const staticsTileset =          require('./../map/tilesets/statics');
const EntitiesList =            require('./EntitiesList');
const Player =                  require('./entities/destroyables/movables/characters/Player');
const DayPhases =               require('./DayPhases');

const playerViewRange =         EntitiesList["Player"].viewRange;
// Need this so that the loops in the functions that emit to players around the player view range go all the way to
// the end of the bottom row and right column, otherwise the actual emit area will be the player view range - 1.
// Precomputed value to avoid having to do `i <= playerViewRange` (2 checks), or `i < playerViewRange + 1` (repeated calculation).
const playerViewRangePlusOne = playerViewRange + 1;
const Directions =              require('./entities/Entity').prototype.Directions;

// Sum the amount of tiles in each previous tileset to get the start GID of each tileset.
const boundariesStartGID = groundTileset.tilecount;
const staticsStartGID = groundTileset.tilecount + boundariesTileset.tilecount;

class BoardTile {

    constructor () {

        /**
         * The ground. Paths, dirt, water, lava, etc. Empty by default (no entities should be able to occupy this tile).
         * @type {GroundTile}
         */
        this.groundType = GroundTypes.Empty;

        /**
         * Whether players can take damage while on this tile.
         * @type {Boolean}
         */
        this.safeZone = false;

        /**
         * Entities that never move or change boards. Can be interacted with and state changed only if interactable.
         * Max one per tile.
         * @type {Static}
         */
        this.static = null;

        /**
         * A sepearate list of destroyables that can be picked up by players and added to their inventory.
         * Also added to the destroyables list.
         * They don't interact with anything else, so less filtering other entities when being picked up.
         * Should NOT occupy a tile that has an active blocking static. Accessed by their entity ID.
         * @type {Object}
         */
        this.pickups = {};

        /**
         * Entities that do not have a definite existence, and so must be sent dynamically to the player.
         * Pickups, Movables (can move and change board), Characters (players, mobs), Projectiles).
         * Should NOT occupy a tile that has an active blocking static. Accessed by their entity ID.
         * @type {{}}
         */
        this.destroyables = {};

        /**
         * A separate list of destroyables just for Players, mainly for emitting events, less messing around filtering other entities.
         * Anything in here should also be in the destroyables list.
         * @type {{}}
         */
        this.players = {};
    }

    /**
     * Whether this tile is currently being low blocked by the static on it, if there is one.
     * @returns {Boolean}
     */
    isLowBlocked () {
        if(this.static === null) return false;

        return this.static.isLowBlocked();
    }

    /**
     * Whether this tile is currently being high blocked by the static on it, if there is one.
     * @returns {Boolean}
     */
    isHighBlocked () {
        if(this.static === null) return false;

        return this.static.isHighBlocked();
    }

    /**
     * Checks if this tile contains any destroyable entities. Is the destroyable object empty.
     * @returns {Boolean}
     */
    containsAnyDestroyables () {
        // Check if there are any own properties on the destroyables object.
        if(Object.keys(this.destroyables).length === 0){
            return false;
        }
        else {
            return true;
        }
    }

}
// Easy access to the list of ground types.
BoardTile.prototype.GroundTypes = GroundTypes;

class Board {

    /**
     * A board for entities to exist on. The game world is made up of boards. Boards are made up of tiles.
     * @param {*} mapData
     * @param {String} name
     * @param {Boolean} alwaysNight - Whether this board will ignore changes in the time of day outside.
     * @param {Boolean} isDungeon - Whether this board is for a dungeon.
     */
    constructor (mapData, name, alwaysNight, isDungeon) {

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

        // The parts of the board data to create the client map files from.
        this.clientGroundData = [];
        this.clientStaticsData = [];

        // How many Tiled units each grid cell is wide/high. Used to divide the x/y of an object to get the col/row.
        this.tileSize = 16;

        // How many rows this board has.
        this.rows = 0;
        // How many columns this board has.
        this.cols = 0;

        // The area bounds of where things can come into a zone. Accessed by their entrance name.
        this.entrances = {};

        // The area bounds of where new entities will be spawned into a zone. Accessed by their entity id.
        //this.spawners = {}; <-- TODO: what is this being used for? maybe for resetting dungeon spawners in the future.

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
        if(this.alwaysNight === true) this.dayPhase = DayPhases.Night;

        /** @type {Boolean} Whether this board is for a dungeon, and any breakables inside it will not be breakable. */
        this.isDungeon = isDungeon || false;

        // The data to use to build the map.
        this.mapData = mapData;

        // Build the map.
        this.createBoard();

        this.createClientBoardData();

        // No longer need the map data for this zone.
        this.mapData = undefined;
        // Or the client data.
        this.clientGroundData = undefined;
        this.clientStaticsData = undefined;

    }

    createBoard () {

        const mapData = this.mapData;

        this.rows = this.mapData.height;
        this.cols = this.mapData.width;

        // Load the map objects.
        // Check that there is some map data for the map of this board.
        if(mapData === undefined){
            Utils.error("No map data found for this board when creating board " + this.name);
            return;
        }

        var i = 0,
            j = 0,
            len = 0,
            layer,
            findLayer = function (layerName) {
                for(var i=0; i<mapData.layers.length; i+=1){
                    if(mapData.layers[i].name === layerName){
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
        let tileID;
        let entity;
        let relativeID;
        let type;
        let row;
        let col;

        // Initialise an empty grid, with a board tile instance for each column in each row.
        for(i=0; i<mapData.height; i+=1){
            // Add a new row.
            this.grid[i] = [];

            for(j=0; j<mapData.width; j+=1){
                // Add a board tile to the grid.
                this.grid[i].push(new BoardTile());
            }
            // Add the same amount of rows to the map data to write to the clients.
            this.clientGroundData[i] = [];
            this.clientStaticsData[i] = [];
        }

        // Check that the boundaries layer exists in the map data.
        layer = findLayer('Boundaries');
        if(layer){
            tilesData = layer.data;
            row = 0;
            col = 0;

            // Add the boundary properties to the grid.
            for(i=0, len=tilesData.length; i<len; i+=1){
                mapTile = tilesData[i] - 1;

                // Move to the next row when at the width of the map.
                if(col === mapData.width){
                    col = 0;
                    row += 1;
                }

                // Get the ID of the tile relative to the tileset it belongs to.
                relativeID = mapTile - boundariesStartGID;

                if(boundariesTileset.tiles[relativeID] !== undefined){
                    // Get and separate the type from the prefix using the tile GID.
                    type = boundariesTileset.tiles[relativeID].type;

                    // Check that the type of this tile is a valid one.
                    if(type === 'SafeZone'){
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
        if(layer){
            tilesData = layer.data;
            row = 0;
            col = 0;

            // Add the tiles to the grid.
            for(i=0, len=tilesData.length; i<len; i+=1){
                mapTile = tilesData[i] - 1;

                if(groundTileset.tiles[mapTile] === undefined){
                    Utils.error("Invalid/empty map tile found while creating board: " + this.name + " at row: " + row + ", col: " + col);
                }
                // Get and separate the type from the prefix using the tile GID.
                type = groundTileset.tiles[mapTile].type;
                // Move to the next row when at the width of the map.
                if(col === mapData.width){
                    col = 0;
                    row += 1;
                }
                // Keep the tile number to create the client map data later.
                this.clientGroundData[row][col] = mapTile;
                // Check that the type of this tile is a valid one.
                if(GroundTypes[type]){
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

        const board = this;
        class StaticTile extends Array {
            constructor (row, col, tileID, data) {
                super();
                this.push(tileID);
                if(data !== undefined) this.push(data);

                // Add the tile data to the client map data to save.
                board.clientStaticsData[row][col] = this;
            }
        }

        // Check that the statics layer exists in the map data.
        layer = findLayer('Statics');
        if(layer){
            tilesData = layer.data;
            row = 0;
            col = 0;

            // Add the tiles to the grid.
            for(i=0, len=tilesData.length; i<len; i+=1){
                mapTile = tilesData[i] - 1;

                // Move to the next row when at the width of the map.
                if(col === mapData.width){
                    col = 0;
                    row += 1;
                }

                // Get the ID of the tile relative to the tileset it belongs to.
                relativeID = mapTile - staticsStartGID;

                // Relative IDs lower than 0 are for empty grid spaces.
                if(relativeID < 0){
                    // Still need to put something in the statics data for the client.
                    new StaticTile(row, col, 0);
                    // Still need to move the column along.
                    col += 1;
                    // Skip this tile.
                    continue;
                }

                // Skip empty tiles.
                if(mapTile < 0){
                    //console.log("* * * Skipping empty tile:", mapTile);
                    // Still need to move the column along.
                    col += 1;
                    // Skip this tile.
                    continue;
                }

                // A tile might have been placed on the map, but not have a type set.
                // All entities need to be created from a type.
                // Check a type is set.
                if(staticsTileset.tiles[relativeID] === undefined){
                    // Keep the tile number to create the client map data later.
                    new StaticTile(row, col, relativeID);
                    // Still need to move the column along.
                    col += 1;
                    // Skip this tile.
                    continue;
                }
                // A type is set. Create an entity.

                // Get and separate the type from the prefix using the tile GID.
                type = staticsTileset.tiles[relativeID].type;

                // Check that the type of this tile is a valid one.
                if(EntitiesList[type]){
                    // Create the data to store in the client map data.
                    // This can have additional data added to it with .push().
                    const staticTile = new StaticTile(row, col, relativeID);
                    // Create a new entity of the type of this tile.
                    entity = new EntitiesList[type]({row: row, col: col, board: this});
                    // If it is a crafting station, add the type number to the data so the client knows what kind of station this is.
                    if(entity instanceof EntitiesList.CraftingStation) staticTile.push(entity.typeNumber);
                }
                else {
                    //Utils.warning("Entity type doesn't exist for static mapTile type: " + type);
                    // Still need to put something in the statics data for the client.
                    new StaticTile(row, col, relativeID);
                }
                // Move to the next column.
                col += 1;
            }
        }

        layer = findLayer('Configurables');
        // Check that the configurables layer exists in the map data.
        if(layer){
            // This is a object layer, not a tile one, so get the objects data.
            objectsData = layer.objects;

            // Add the entities to the world.
            for(i=0, len=objectsData.length; i<len; i+=1){
                mapObject = objectsData[i];

                // If this entity is a text object, skip it.
                if(mapObject.text !== undefined){
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

                //console.log("object id:", objectID, "type:", type, "mapObject.properties:", mapObject);

                // Check that the type of this tile is a valid one.
                if(EntitiesList[type]){
                    const config = {
                        row: row,
                        col: col,
                        board: this
                    };

                    mapObject.properties = Utils.arrayToObject(mapObject.properties, 'name', 'value');

                    if(mapObject.properties['Disabled']){
                        Utils.warning("Map object is disabled in map data:", mapObject);
                        continue;
                    }

                    switch (type){
                        case 'SpawnerArea':
                            config.width = mapObject.width / this.tileSize;
                            config.height = mapObject.height / this.tileSize;
                            config.entityType = EntitiesList[mapObject.properties['EntityClassName']];
                            config.maxAtOnce = mapObject.properties['MaxAtOnce'];
                            config.spawnRate = mapObject.properties['SpawnRate'];
                            config.testing = mapObject.properties['Testing'];
                            config.dropList = mapObject.properties['DropList'];
                            // Check the entity type to create is valid.
                            if(config.entityType === undefined) continue;
                            break;
                        case 'Exit':
                            config.targetBoard = mapObject.properties['TargetBoard'];
                            config.targetEntranceName = mapObject.properties['TargetEntranceName'];
                            break;
                        case 'DungeonPortal':
                            // Check the dungeon portal properties are valid.
                            if(mapObject.properties === undefined){
                                Utils.warning("No properties set on dungeon portal in map data:", mapObject);
                                continue;
                            }
                            config.targetBoard = mapObject.properties['TargetBoard'];
                            config.targetEntranceName = mapObject.properties['TargetEntranceName'];
                            // Check the dungeon portal properties are valid.
                            if(config.targetBoard === undefined){
                                Utils.warning("Dungeon portal in map data with invalid property:", mapObject);
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
                            break;
                    }

                    // Create a new entity of the type of this tile.
                    entity = new EntitiesList[type](config);

                    // If this configurable is meant to be seen on the client, create the data to store in the client map data.
                    // This can have additional data added to it with .push().

                    // If a dungeon portal, add the dungeon ID to the data.
                    if(entity instanceof EntitiesList.DungeonPortal){
                        new StaticTile(row, col, objectID, entity.dungeon.id);
                    }
                    // If a overworld portal, just add the tile ID.
                    if(entity instanceof EntitiesList.OverworldPortal){
                        new StaticTile(row, col, objectID);
                    }

                }
                else {
                    // If a GUI trigger, just write the data to the client. No server entity needed.
                    if(type === 'GUITrigger'){
                        // Add it to all of the slots this object covers.
                        const objectRows = mapObject.height / 16;
                        const objectCols = mapObject.width / 16;
                        for(let rowOffset=0; rowOffset<objectRows; rowOffset+=1){
                            for(let colOffset=0; colOffset<objectCols; colOffset+=1){
                                new StaticTile(row + rowOffset, col + colOffset, objectID, {
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
                        Utils.warning("Entity type doesn't exist for configurable object type: " + type);
                    }
                }
            }
        }

    }

    createClientBoardData () {

        let clientData = {
            name: this.name,
            groundGrid: this.clientGroundData,
            staticsGrid: this.clientStaticsData
        };

        const json = JSON.stringify(clientData);

        Utils.checkDirectoryExists('../client/assets/map');

        // Write the data to the file in the client files.
        fs.writeFileSync("../client/assets/map/" + this.name + ".json", json, "utf8");

        console.log("* Board data written to client: " + this.name);
    }

    /**
     * @param {Destroyable} entity
     */
    addDestroyable (entity) {
        this.grid[entity.row][entity.col].destroyables[entity.id] = entity;
    }

    /**
     * @param {Destroyable} entity
     */
    removeDestroyable (entity) {
        delete this.grid[entity.row][entity.col].destroyables[entity.id];
    }

    /**
     * @param {Player} player
     */
    addPlayer (player) {
        this.grid[player.row][player.col].players[player.id] = player;
        // Players are also added to the destroyables list, in the constructor of Destroyable.
    }

    /**
     * @param {Player} player
     */
    removePlayer (player) {
        delete this.grid[player.row][player.col].players[player.id];
        // Players are also removed from the destroyables list, in the onDestroy of Destroyable.
    }

    /**
     * @param {Static} entity
     */
    addStatic (entity) {
        this.grid[entity.row][entity.col].static = entity;
    }

    /**
     * ONLY use to remove buildables (clan structures).
     * Entrances occupy the static slots of the whole area they cover, so all of it won't be cleaned up if removed.
     * @param entity
     */
    removeStatic (entity) {
        this.grid[entity.row][entity.col].static = null;
    }

    /**
     * @param {Pickup} entity
     */
    addPickup (entity) {
        this.grid[entity.row][entity.col].pickups[entity.id] = entity;
    }

    /**
     * @param {Pickup} entity
     */
    removePickup (entity) {
        delete this.grid[entity.row][entity.col].pickups[entity.id];
    }

    /**
     * Get all of the destroyables (and any interactables that are not in their default state) that are within the player view range of the target position.
     * @param {Number} row
     * @param {Number} col
     * @return {Array} Returns an array containing the entities found.
     */
    getNearbyDynamicsData (row, col) {
        //console.log("getNearbyDynamicsData");
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

        for(; rowOffset<playerViewRangePlusOne; rowOffset+=1){
            for(colOffset=-playerViewRange; colOffset<playerViewRangePlusOne; colOffset+=1){

                currentRow = this.grid[row + rowOffset];
                // Check for invalid array index access.
                if(currentRow === undefined) continue;
                currentTile = currentRow[col + colOffset];
                if(currentTile === undefined) continue;

                destroyables = currentTile.destroyables;
                // Get all of the destroyable entities on this board tile.
                for(entityKey in destroyables){
                    if(destroyables.hasOwnProperty(entityKey)){
                        // Add the relevant data of this entity to the data to return.
                        nearbyDynamics.push(
                            destroyables[entityKey].getEmittableProperties({})
                        );
                    }
                }

                // Now get the state of the interactable if it isn't in its default state.
                interactable = currentTile.static;
                // Check there is actually one there.
                if(interactable !== null){
                    // Check if it is not in its default state. If not, add it to the data.
                    // Also checks if it is actually an interactable.
                    if(interactable.activeState === false){
                        //console.log("interactable added to data to send, id:", entity.id);
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
    getDynamicsAtViewRangeData (row, col, direction) {
        //console.log("get dyns at view range data, dir:", direction);
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

        if(direction === Directions.LEFT){
            // Go to the left column of the view range, then loop down that column from the top of the view range to the bottom.
            for(let i=-playerViewRange; i<playerViewRangePlusOne; i+=1){

                // Check for invalid array index access.
                if(this.grid[row + i] === undefined) continue;
                currentTile = this.grid[row + i][col - playerViewRange];
                if(currentTile === undefined) continue;

                destroyables = currentTile.destroyables;
                // Get all of the destroyable entities on this board tile.
                for(entityKey in destroyables){
                    if(destroyables.hasOwnProperty(entityKey)){
                        // Add the relevant data of this entity to the data to return.
                        edgeDynamics.push(
                            destroyables[entityKey].getEmittableProperties({})
                        );
                    }
                }

                // Now get the state of the interactable if it isn't in its default state.
                interactable = currentTile.static;
                // Check there is actually one there.
                if(interactable !== null){
                    // Check if it is not in its default state. If not, add it to the data.
                    // Also checks if it is actually an interactable.
                    if(interactable.activeState === false){
                        //console.log("interactable added to data to send, id:", entity.id);
                        // Add the relevant data of this entity to the data to return.
                        edgeDynamics.push(
                            interactable.getEmittableProperties({})
                        );
                    }
                }
            }
        }
        else if(direction === Directions.RIGHT){
            // Go to the right column of the view range, then loop down that column from the top of the view range to the bottom.
            for(let i=-playerViewRange; i<playerViewRangePlusOne; i+=1){

                // Check for invalid array index access.
                if(this.grid[row + i] === undefined) continue;
                currentTile = this.grid[row + i][col + playerViewRange];
                if(currentTile === undefined) continue;

                destroyables = currentTile.destroyables;
                // Get all of the destroyable entities on this board tile.
                for(entityKey in destroyables){
                    if(destroyables.hasOwnProperty(entityKey)){
                        // Add the relevant data of this entity to the data to return.
                        edgeDynamics.push(
                            destroyables[entityKey].getEmittableProperties({})
                        );
                    }
                }

                // Now get the state of the interactable if it isn't in its default state.
                interactable = currentTile.static;
                // Check there is actually one there.
                if(interactable !== null){
                    // Check if it is not in its default state. If not, add it to the data.
                    // Also checks if it is actually an interactable.
                    if(interactable.activeState === false){
                        //console.log("interactable added to data to send, id:", entity.id);
                        // Add the relevant data of this entity to the data to return.
                        edgeDynamics.push(
                            interactable.getEmittableProperties({})
                        );
                    }
                }
            }
        }
        else if(direction === Directions.UP){
            // Go to the top row of the view range, then loop along that row from the left of the view range to the right.
            for(let i=-playerViewRange; i<playerViewRangePlusOne; i+=1){

                // Check for invalid array index access.
                if(this.grid[row - playerViewRange] === undefined) continue;
                currentTile = this.grid[row - playerViewRange][col + i];
                if(currentTile === undefined) continue;

                destroyables = currentTile.destroyables;
                // Get all of the destroyable entities on this board tile.
                for(entityKey in destroyables){
                    if(destroyables.hasOwnProperty(entityKey)){
                        // Add the relevant data of this entity to the data to return.
                        edgeDynamics.push(
                            destroyables[entityKey].getEmittableProperties({})
                        );
                    }
                }

                // Now get the state of the interactable if it isn't in its default state.
                interactable = currentTile.static;
                // Check there is actually one there.
                if(interactable !== null){
                    // Check if it is not in its default state. If not, add it to the data.
                    // Also checks if it is actually an interactable.
                    if(interactable.activeState === false){
                        //console.log("interactable added to data to send, id:", entity.id);
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
            for(let i=-playerViewRange; i<playerViewRangePlusOne; i+=1){

                // Check for invalid array index access.
                if(this.grid[row + playerViewRange] === undefined) continue;
                currentTile = this.grid[row + playerViewRange][col + i];
                if(currentTile === undefined) continue;

                destroyables = currentTile.destroyables;
                // Get all of the destroyable entities on this board tile.
                for(entityKey in destroyables){
                    if(destroyables.hasOwnProperty(entityKey)){
                        // Add the relevant data of this entity to the data to return.
                        edgeDynamics.push(
                            destroyables[entityKey].getEmittableProperties({})
                        );
                    }
                }

                // Now get the state of the interactable if it isn't in its default state.
                interactable = currentTile.static;
                // Check there is actually one there.
                if(interactable !== null){
                    // Check if it is not in its default state. If not, add it to the data.
                    // Also checks if it is actually an interactable.
                    if(interactable.activeState === false){
                        //console.log("interactable added to data to send, id:", entity.id);
                        // Add the relevant data of this entity to the data to return.
                        edgeDynamics.push(
                            interactable.getEmittableProperties({})
                        );
                    }
                }
            }
        }

        // If there were no dynamics at the edge of the view range, return false.
        if(edgeDynamics.length === 0) return false;

        return edgeDynamics;
    }

    /**
     * Gets all Player entities within a given range around a target position.
     * @param {Number} row
     * @param {Number} col
     * @param {Number} range
     * @returns {Array} An array of Player entities.
     */
    getNearbyPlayers (row, col, range) {
        //console.log("get nearby players, range:", range);
        const nearbyPlayers = [],
            grid = this.grid,
            rangePlusOne = range + 1;

        let rowOffset = -range,
            colOffset = -range,
            targetRow,
            targetCol,
            playerKey,
            players;

        for(; rowOffset<rangePlusOne; rowOffset+=1){
            for(colOffset=-range; colOffset<rangePlusOne; colOffset+=1){
                targetRow = rowOffset + row;
                // Check the grid element being accessed is valid.
                if(grid[targetRow] === undefined) continue;
                targetCol = colOffset + col;
                if(grid[targetRow][targetCol] === undefined) continue;

                players = grid[targetRow][targetCol].players;

                for(playerKey in players){
                    if(players.hasOwnProperty(playerKey) === false) continue;

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
    emitToNearbyPlayers (row, col, eventNameID, data, range) {
        //console.log("emit to nearby players");
        let nearbyRange = playerViewRange,
            nearbyRangePlusOne = playerViewRangePlusOne;

        if(range !== undefined){
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

        for(; rowOffset<nearbyRangePlusOne; rowOffset+=1){
            for(colOffset=-nearbyRange; colOffset<nearbyRangePlusOne; colOffset+=1){
                targetRow = rowOffset + row;
                // Check the grid element being accessed is valid.
                if(grid[targetRow] === undefined) continue;
                targetCol = colOffset + col;
                if(grid[targetRow][targetCol] === undefined) continue;

                players = grid[targetRow][targetCol].players;

                //console.log("etnp:", eventNameID);

                //console.log("players at: " + (i + row) + " | " + (j + col), players);

                ownPropNames = Object.getOwnPropertyNames(players);

                for(propIndex=0; propIndex<ownPropNames.length; propIndex+=1){
                    socket = players[ownPropNames[propIndex]].socket;
                    // Make sure this socket connection is in a ready state. Might have just closed or be closing.
                    if(socket.readyState === 1){
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
    emitToPlayers (players, eventNameID, data) {
        let playerKey;
        // Find all of the player entities on this board tile.
        for (playerKey in players){
            if(players.hasOwnProperty(playerKey)){
                // Make sure this socket connection is in a ready state. Might have just closed or be closing.
                if(players[playerKey].socket.readyState === 1){
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
    emitToPlayersAtViewRange (row, col, direction, eventNameID, data) {
        let currentRow;

        if(direction === Directions.LEFT){
            // Go to the left column of the view range, then loop down that column from the top of the view range to the bottom.
            for(let rowOffset=-playerViewRange; rowOffset<playerViewRangePlusOne; rowOffset+=1) {

                currentRow = this.grid[row + rowOffset];
                // Check for invalid array index access.
                if(currentRow === undefined) continue;
                if(currentRow[col - playerViewRange] === undefined) continue;

                this.emitToPlayers(currentRow[col - playerViewRange].players, eventNameID, data);
            }
        }
        else if(direction === Directions.RIGHT) {
            // Go to the right column of the view range, then loop down that column from the top of the view range to the bottom.
            for(let rowOffset=-playerViewRange; rowOffset<playerViewRangePlusOne; rowOffset+=1){

                currentRow = this.grid[row + rowOffset];
                // Check for invalid array index access.
                if(currentRow === undefined) continue;
                if(currentRow[col + playerViewRange] === undefined) continue;

                this.emitToPlayers(currentRow[col + playerViewRange].players, eventNameID, data);
            }
        }
        else if(direction === Directions.UP) {
            // Go to the top row of the view range, then loop along that row from the left of the view range to the right.
            for(let colOffset=-playerViewRange; colOffset<playerViewRangePlusOne; colOffset+=1){

                currentRow = this.grid[row - playerViewRange];
                // Check for invalid array index access.
                if(currentRow === undefined) continue;
                if(currentRow[col + colOffset] === undefined) continue;

                this.emitToPlayers(currentRow[col + colOffset].players, eventNameID, data);
            }
        }
        else {
            // Go to the bottom row of the view range, then loop along that row from the left of the view range to the right.
            for(let colOffset=-playerViewRange; colOffset<playerViewRangePlusOne; colOffset+=1){

                currentRow = this.grid[row + playerViewRange];
                // Check for invalid array index access.
                if(currentRow === undefined) continue;
                if(currentRow[col + colOffset] === undefined) continue;

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
    rowColOffsetToDirection (rowOffset, colOffset) {
        if(rowOffset < 0) return Directions.UP;

        if(rowOffset > 0) return Directions.DOWN;

        if(colOffset < 0) return Directions.LEFT;

        if(colOffset > 0) return Directions.RIGHT;

        if(rowOffset === 0 && colOffset === 0) return Directions.UP;

        Utils.error("A valid offset wasn't given to Board.rowColOffsetToDirection, row: " + rowOffset + ", col: " + colOffset);
    }

    /**
     * Converts a direction into a row and column offset.
     * @param {String} direction
     * @return {Object} The offset of the direction. An object of {row: Number, col: Number}.
     */
    directionToRowColOffset (direction) {
        const offset = {
            row: 0,
            col: 0
        };

        if(direction === Directions.UP){
            offset.row = -1;
            return offset;
        }
        if(direction === Directions.DOWN){
            offset.row = 1;
            return offset;
        }
        if(direction === Directions.LEFT){
            offset.col = -1;
            return offset;
        }
        if(direction === Directions.RIGHT){
            offset.col = 1;
            return offset;
        }
        Utils.error("A valid direction wasn't given to Board.directionToRowColOffset, direction: " + direction);
    }

    /**
     * Gets the row and column of the board tile in front of the direction from a given row/col.
     * @param {String} direction
     * @param {Number} fromRow
     * @param {Number} fromCol
     * @return {Object} The row and col of the tile in front. An object of {row: Number, col: Number}.
     */
    getRowColInFront (direction, fromRow, fromCol) {
        if(Number.isInteger(fromRow) === false) {
            Utils.error("A valid number wasn't given to Board.getRowColInFront, fromRow: " + fromRow);
        }
        if(Number.isInteger(fromCol) === false) {
            Utils.error("A valid number wasn't given to Board.getRowColInFront, fromCol: " + fromCol);
        }

        const front = {
            row: fromRow,
            col: fromCol
        };

        if(direction === Directions.UP){
            front.row -= 1;
            return front;
        }
        if(direction === Directions.DOWN){
            front.row += 1;
            return front;
        }
        if(direction === Directions.LEFT){
            front.col -= 1;
            return front;
        }
        if(direction === Directions.RIGHT){
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
    getRowColOnOppositeSide (midRow, midCol, fromRow, fromCol) {
        const opposite = {
            row: midRow,
            col: midCol
        };
        // On the same row, so could be a column difference.
        if(fromRow === midRow){
            opposite.col = midCol + (midCol - fromCol);
        }
        // On the same column, so could be a row difference.
        else if(fromCol === midCol){
            opposite.col = midRow + (midRow - fromRow);
        }
        return opposite;
    }

    /**
     * Can the target tile be built on by a clan.
     * @param {Number} row
     * @param {Number} col
     * @returns {Boolean} Whether the tile is buildable or not.
     */
    isTileBuildable (row, col) {
        //console.log("is tile buildable");
        // Check this board is the overworld. Can only build on the overworld.
        if(this !== boardsObject['overworld']){
            //console.log("  this board is NOT the overworld");
            return false;
        }

        // Check there is nothing in the way.
        const grid = this.grid;
        if(grid[row] === undefined) return false;
        /** @type {BoardTile} */
        const boardTile = grid[row][col];
        if(boardTile === undefined) return false;
        // Breakables can be occupied (moved over) if broken, but they should never be able to be built on.
        if(boardTile.static !== null) {
            //console.log("  has a static");
            return false;
        }
        if(boardTile.safeZone === true) {
            //console.log("  is a safe zone");
            return false;
        }
        if(boardTile.groundType.canBeBuiltOn === false){
            //console.log("  ground type can not be built on");
            return false;
        }
        if(boardTile.containsAnyDestroyables() === true){
            //console.log("  has a destroyable");
            return false;
        }

        //console.log("  is buildable");

        return true;
    }

}

module.exports = Board;

const boardsObject = require('./BoardsList').boardsObject;