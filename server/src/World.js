const { wss } = require("./Server");
const Utils = require("./Utils");
const settings = require("../settings");
const AccountManager = require("./account/AccountManager");
// const clanManager = require("./gameplay/ClanManager");
const DungeonManager = require("./dungeon/DungeonManager");
const DungeonManagersList = require("./dungeon/DungeonManagersList");
const EventsList = require("./EventsList");
const BoardsList = require("./board/BoardsList");
const DayPhases = require("./DayPhases");
const Board = require("./board/Board");
const EntitiesList = require("./entities/EntitiesList");
const Exit = require("./entities/classes/statics/interactables/exits/Exit");

// Set up the day phase cycle.
const dayPhaseCycle = [];
// 11 parts day and night, 1 part transition between them.
Utils.arrayMultiPush(dayPhaseCycle, DayPhases.Day, 10);
Utils.arrayMultiPush(dayPhaseCycle, DayPhases.Dusk, 3);
Utils.arrayMultiPush(dayPhaseCycle, DayPhases.Night, 9);
Utils.arrayMultiPush(dayPhaseCycle, DayPhases.Dawn, 2);

const fullDayDuration = 60000 * settings.FULL_DAY_DURATION_MINUTES;
// Keep the length of a whole day the same, regarless of how many cycle phases each day has.
const dayPhaseRate = fullDayDuration / dayPhaseCycle.length;
Utils.message("Full day duration:", settings.FULL_DAY_DURATION_MINUTES, "minutes.");
Utils.message("Day phase rate:", dayPhaseRate / 60000, "minutes.");

const world = {
    /** @type {Number} How many players are currently in the game. */
    playerCount: 0,

    /** @type {Number} How many players can be in the game at once. */
    maxPlayers: settings.MAX_PLAYERS || 1000,

    /** @type {Array.<Board>} A list of board in the world, by index. */
    boardsArray: BoardsList.boardsArray,

    /** @type {Object.<Board>} A list of boards in the world, by their ID. */
    boardsObject: BoardsList.boardsObject,

    /** @type {Number} The time of day. Dawn, night, etc. */
    dayPhase: DayPhases.Day,

    init() {
        // Read each of the map data files in the map directory and load them.
        const fs = require("fs");
        const dirs = fs.readdirSync("map", { encoding: "utf-8", withFileTypes: true });
        const path = require("path");

        dirs.forEach((elem) => {
            const parsed = path.parse(elem.name);
            // Skip the blank template map.
            if (parsed.name === "BLANK") return;

            // Only load JSON map data.
            if (parsed.ext === ".json") {
                if (this.createBoard(parsed.name)) {
                    // Do this after the board/dungeon manager is created, or the client board data won't
                    // have the dungeon manager ID to use for any dungeon portals that need that ID.
                    Board.createClientBoardData(parsed.name);
                }
            }
        });

        // Load the clans into the game world after the boards are
        // created, or there will be nothing to add the structures to.
        // clanManager.loadDataFromFile();

        // Wire up all of the exits to the entrances of each board.
        // Need to do this after the boards have been created, otherwise
        // there might be nothing to link to while the exits are being created.
        this.linkExits();

        this.linkDungeonManagerEvictionBoards();

        // Start the day/night cycle loop.
        setTimeout(this.progressTime, dayPhaseRate);
    },

    /**
     * Create an instance of a board for a map that should
     * exist at the start and not be added in later.
     * @param {String} dataFileName - The end part of the URL to the map data file.
     * @returns {Boolean} - Whether the world should continue any other setup that involves this board.
     */
    createBoard(dataFileName) {
        const data = require(`../map/${dataFileName}.json`);

        const mapProperties = Utils.arrayToObject(data.properties, "name", "value");

        // Skip disabled maps.
        if (mapProperties.Disabled === true) {
            Utils.message("Skipping disabled map:", dataFileName);
            return false;
        }

        let alwaysNight = false;
        if (mapProperties.AlwaysNight === undefined) Utils.warning(`Map data is missing property: "AlwaysNight". Using default (false). On map: ${dataFileName}`);
        if (mapProperties.AlwaysNight === true) alwaysNight = true;

        if (mapProperties.IsDungeon === undefined) Utils.warning(`Map data is missing property: "IsDungeon". Using default (false). On map: ${dataFileName}`);
        if (mapProperties.IsDungeon === true) {
            if (!mapProperties.Difficulty) Utils.warning(`Dungeon map is missing property: "Difficulty". Using default. On map: ${dataFileName}`);
            if (!mapProperties.NameDefinitionID) Utils.warning(`Dungeon map is missing property: "NameDefinitionID". Using default. On map: ${dataFileName}`);
            if (!mapProperties.MaxPlayers) Utils.warning(`Dungeon map is missing property: "MaxPlayers". Using default. On map: ${dataFileName}`);
            if (!mapProperties.TimeLimitMinutes) Utils.warning(`Dungeon map is missing property: "TimeLimitMinutes". Using default. On map: ${dataFileName}`);
            if (!mapProperties.EvictionMapName) Utils.warning(`Dungeon map is missing property: "EvictionMapName". Using default. On map: ${dataFileName}`);
            if (!mapProperties.EvictionEntranceName) Utils.warning(`Dungeon map is missing property: "EvictionEntranceName". Using default. On map: ${dataFileName}`);

            new DungeonManager({
                name: dataFileName,
                nameDefinitionID: mapProperties.NameDefinitionID,
                mapData: data,
                alwaysNight,
                maxPlayers: mapProperties.MaxPlayers,
                timeLimitMinutes: mapProperties.TimeLimitMinutes,
                difficultyName: mapProperties.Difficulty,
                evictionMapName: mapProperties.EvictionMapName,
                evictionEntranceName: mapProperties.EvictionEntranceName,
            });

            // Stop here. Don't create a board for a dungeon map, as they are created
            // dynamically when a dungeon instance is created by the dungeon manager.
            return true;
        }

        const board = new Board(data, dataFileName, alwaysNight);
        if (board.alwaysNight === false) {
            board.dayPhase = this.dayPhase;
        }

        this.boardsArray.push(board);
        this.boardsObject[dataFileName] = board;

        return true;
    },

    linkExits() {
        let row;
        let rowLen;
        let col;
        let colLen;
        let exit;

        this.boardsArray.forEach((board) => {
            // For each row in the board grid.
            for (row = 0, rowLen = board.grid.length; row < rowLen; row += 1) {
                // For each column in that row.
                for (col = 0, colLen = board.grid[row].length; col < colLen; col += 1) {
                    // Check if the static is an exit.
                    if (board.grid[row][col].static instanceof Exit) {
                        exit = board.grid[row][col].static;
                        // If the target for this exit isn't valid (might have been removed from the map), then destroy this exit.
                        if (this.boardsObject[exit.targetBoard] === undefined) {
                            Utils.warning("Cannot link exit. Board of given name not found in the boards list:", exit.targetBoard);
                            exit.destroy();
                            continue;
                        }
                        if (this
                            .boardsObject[exit.targetBoard]
                            .entrances[exit.targetEntrance]
                            === undefined) {
                            Utils.warning("Cannot link exit. Entrance of given name not found in the board entrances list:", exit.targetEntrance, "for board:", exit.targetBoard);
                            exit.destroy();
                            continue;
                        }
                        // Currently, the exits have the string name of the board and entrance they should
                        // use in place of the actual objects, which are now used to set the actual objects.
                        exit.targetBoard = this.boardsObject[exit.targetBoard];
                        exit.targetEntrance = exit.targetBoard.entrances[exit.targetEntrance];
                    }
                }
            }
        });
    },

    linkDungeonManagerEvictionBoards() {
        Object.values(DungeonManagersList.ByID).forEach((dungeonManager) => {
            const evictionBoard = BoardsList.boardsObject[dungeonManager.evictionBoard];
            if (!evictionBoard) {
                Utils.error(`Cannot link dungeon manager eviction board for "${dungeonManager.name}".\nA board does not exist of given name: ${dungeonManager.evictionBoard}`);
            }
            dungeonManager.evictionBoard = evictionBoard;

            const evictionEntrance = evictionBoard.entrances[dungeonManager.evictionEntrance];
            if (!evictionEntrance) {
                Utils.error(`Cannot link dungeon manager eviction entrance for "${dungeonManager.name}".\nAn entrance on the eviction board does not exist of given name: ${dungeonManager.evictionEntrance}`);
            }
            dungeonManager.evictionEntrance = evictionEntrance;
        });
    },

    /**
     * Prepares any data that a client will need to know as soon as it starts the game state.
     * @param {Player} playerEntity
     */
    getPlayerDataToSend(playerEntity) {
        const dataToSend = {};

        dataToSend.inventory = playerEntity.inventory.getEmittableProperties();
        dataToSend.bank = playerEntity.bank.getEmittableProperties();
        dataToSend.boardName = playerEntity.board.name;
        dataToSend.boardAlwaysNight = playerEntity.board.alwaysNight;
        dataToSend.dayPhase = playerEntity.board.dayPhase;
        dataToSend.player = {
            id: playerEntity.id,
            row: playerEntity.row,
            col: playerEntity.col,
            displayName: playerEntity.displayName,
            hitPoints: playerEntity.hitPoints,
            maxHitPoints: playerEntity.maxHitPoints,
            energy: playerEntity.energy,
            maxEnergy: playerEntity.maxEnergy,
            defence: playerEntity.defence,
            glory: playerEntity.glory,
            moveRate: playerEntity.moveRate,
            stats: playerEntity.stats.getEmittableStats(),
            tasks: playerEntity.tasks.getEmittableTasks(),
        };
        // Get the things this player can see.
        dataToSend.dynamicsData = playerEntity.board.getNearbyDynamicsData(
            playerEntity.row,
            playerEntity.col,
        );

        return dataToSend;
    },

    /**
     * Add a player entity to the game world from an existing player account.
     * @param {Object} clientSocket
     * @param {AccountModel} account
     */
    addExistingPlayer(clientSocket, account) {
        Utils.message(`World add existing player (${(new Date()).toGMTString()}):`, account.displayName);

        if (clientSocket.entity !== undefined) {
            // Weird bug... :S
            Utils.warning("* * * * * adding existing player, but client socket already has an entity");
        }

        // Don't let too many players in the world.
        if (this.playerCount >= this.maxPlayers) {
            clientSocket.sendEvent(EventsList.world_full);
            return;
        }

        // Start them in the overworld if they have played before.
        const randomPosition = this
            .boardsObject[settings.PLAYER_SPAWN_BOARD_NAME]
            .entrances[settings.PLAYER_SPAWN_ENTRANCE_NAME]
            .getRandomPosition();

        /** @type {Player} */
        const playerEntity = new EntitiesList.Player({
            row: randomPosition.row,
            col: randomPosition.col,
            board: this.boardsObject[settings.PLAYER_SPAWN_BOARD_NAME],
            displayName: account.displayName,
            socket: clientSocket,
        });

        AccountManager.loadPlayerData(playerEntity, account);

        const dataToSend = this.getPlayerDataToSend(playerEntity);

        // Tell them they are logged in.
        dataToSend.isLoggedIn = true;

        // Tell the nearby players to add this new player, after they are full set up (if an account was loaded, the properties will have been modified after object creation).
        playerEntity.emitToNearbyPlayers();

        clientSocket.sendEvent(EventsList.join_world_success, dataToSend);

        clientSocket.inGame = true;

        this.playerCount += 1;

        Utils.message("Player count:", this.playerCount);
    },

    /**
     * Add a new player entity to the game world, without an associated player account.
     * They can create an account to associate with later.
     * @param {Object} clientSocket
     * @param {String} displayName
     */
    addNewPlayer(clientSocket, displayName) {
        Utils.message(`World add new player (${(new Date()).toGMTString()}):`, displayName);

        if (clientSocket.entity !== undefined) {
            // Weird bug... :S
            Utils.warning("* * * * adding new player, but client socket already has an entity");
        }

        // Don't let too many players in the world.
        if (this.playerCount >= this.maxPlayers) {
            clientSocket.sendEvent(EventsList.world_full);
            return;
        }

        const randomPosition = this
            .boardsObject[settings.NEW_PLAYER_SPAWN_BOARD_NAME]
            .entrances[settings.NEW_PLAYER_SPAWN_ENTRANCE_NAME]
            .getRandomPosition();

        /** @type {Player} */
        const playerEntity = new EntitiesList.Player({
            row: randomPosition.row,
            col: randomPosition.col,
            board: this.boardsObject[settings.NEW_PLAYER_SPAWN_BOARD_NAME],
            displayName,
            socket: clientSocket,
        });

        // Give the new player some starting tasks, as they are NOT added automatically for player entities.
        playerEntity.tasks.addStartingTasks();
        // New accounts get some free stuff in their inventory, so add those properties.
        playerEntity.inventory.addStarterItems();
        // New accounts get some free stuff in their bank, so add those properties.
        playerEntity.bank.addStarterItems();

        const dataToSend = this.getPlayerDataToSend(playerEntity);

        // Tell the nearby players to add this new player, after they are full set up (if an account was loaded, the properties will have been modified after object creation).
        playerEntity.emitToNearbyPlayers();

        clientSocket.sendEvent(EventsList.join_world_success, dataToSend);

        clientSocket.inGame = true;

        this.playerCount += 1;

        Utils.message("Player count:", this.playerCount);
    },

    /**
     * Remove the given player from the world and the game.
     * @param {Object} clientSocket - The socket of the player entity to remove.
     */
    removePlayer(clientSocket) {
        if (clientSocket.entity) {
            Utils.message(`World remove player (${(new Date()).toGMTString()}):`, clientSocket.entity.displayName);
        }

        // If the socket had an entity, remove it from the game.
        if (clientSocket.entity !== undefined) {
            // If they have an account log them out.
            if (clientSocket.account) {
                AccountManager.logOut(clientSocket);
            }

            clientSocket.entity.remove();
            // Remove the reference to the player entity.
            delete clientSocket.entity;
        }

        if (clientSocket.inGame) {
            clientSocket.inGame = false;
            // Reduce the player count.
            this.playerCount -= 1;
        }

        Utils.message("Player count:", this.playerCount);
    },

    /**
     * Move the game day phase along one phase.
     */
    progressTime() {
        // Shuffle the time along to the next period.
        dayPhaseCycle.push(dayPhaseCycle.shift());

        // Utils.message("Day phase progressed:", dayPhaseCycle[0]);

        // Check if the period is different than last. Don't bother updating the boards/players if it is the same. i.e. day and night last more than one phase.
        if (dayPhaseCycle[0] !== this.dayPhase) {
            // Get whatever is at the front.
            this.dayPhase = dayPhaseCycle[0];

            BoardsList.boardsArray.forEach((board) => {
                // Don't change the time inside dungeons and caves etc. They are always dark (night).
                if (board.alwaysNight === false) {
                    board.dayPhase = this.dayPhase;
                }
            });

            // Tell the boards and everyone on them the time has changed.
            wss.broadcastToInGame(EventsList.change_day_phase, this.dayPhase);
        }

        setTimeout(world.progressTime, dayPhaseRate);
    },

};

module.exports = world;
