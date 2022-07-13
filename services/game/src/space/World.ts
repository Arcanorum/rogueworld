import { Settings } from '@rogueworld/configs';
import { GameMap, Maps } from '@rogueworld/maps';
import { DayPhases, ObjectOfUnknown, RowCol } from '@rogueworld/types';
import {
    arrayMultiPush, arrayOfObjectsToObject, getRandomElement, message, warning,
} from '@rogueworld/utils';
import { Board } from '.';
import { AccountDocument, loadPlayerData, logOut } from '../database';
import Player from '../entities/classes/Player';
import { EntitiesList } from '../entities';
import { webSocketServer as wss } from '../Server';
import PlayerWebSocket from '../websocket_events/PlayerWebSocket';
import { boardsArray, boardsObject } from './BoardsList';
import { createClientBoardData } from './CreateClientBoardData';

// Set up the day phase cycle.
const dayPhaseCycle: Array<DayPhases> = [];
// 11 parts day and night, 1 part transition between them.
arrayMultiPush(dayPhaseCycle, DayPhases.Day, 10);
arrayMultiPush(dayPhaseCycle, DayPhases.Dusk, 3);
arrayMultiPush(dayPhaseCycle, DayPhases.Night, 9);
arrayMultiPush(dayPhaseCycle, DayPhases.Dawn, 2);

const fullDayDuration = 60000 * Settings.FULL_DAY_DURATION_MINUTES;
// Keep the length of a whole day the same, regarless of how many cycle phases each day has.
const dayPhaseRate = fullDayDuration / dayPhaseCycle.length;
message('Full day duration:', Settings.FULL_DAY_DURATION_MINUTES, 'minutes.');
message('Day phase rate:', dayPhaseRate / 60000, 'minutes.');

interface PlayerData {
    inventory: ObjectOfUnknown;
    // bank: ObjectOfUnknown;
    boardName: string;
    boardAlwaysNight: boolean;
    dayPhase: number;
    player: {
        id: number;
        row: number;
        col: number;
        displayName: string;
        hitPoints: number;
        maxHitPoints: number;
        food: number;
        maxFood: number;
        defence: number;
        glory: number;
        moveRate: number;
    };
    dynamicsData: Array<ObjectOfUnknown>;
    isLoggedIn?: boolean;
    accountId?: string;
}

const World = {
    /** How many players are currently in the game. */
    playerCount: 0,

    /** How many players can be in the game at once. */
    maxPlayers: Settings.MAX_PLAYERS || 1000,

    /** The time of day. Dawn, night, etc. */
    dayPhase: DayPhases.Day,

    /** Whether the game world has been initialised and is ready to be used. */
    initialised: false,

    init() {
        Maps.forEach((map) => {
            if (this.createBoard(map)) {
                // Do this after the board/dungeon manager is created, or the client board data
                // won't have the dungeon manager ID to use for any dungeon portals that need that
                // ID.
                createClientBoardData(map);
            }
        });

        // Start the day/night cycle loop.
        setTimeout(this.progressTime, dayPhaseRate);

        this.initialised = true;
    },

    /**
     * Create an instance of a board for a map that should exist at the start and not be added in
     * later.
     * @returns Whether the world should continue any other setup that involves this board.
     */
    createBoard(map: GameMap) {
        const mapProperties = arrayOfObjectsToObject(map.data.properties, 'name', 'value');

        // Skip disabled maps.
        if (mapProperties.Disabled === true) {
            message('Skipping disabled map:', map.name);
            return false;
        }

        let alwaysNight = false;
        if (mapProperties.AlwaysNight === undefined) warning(`Map data is missing property: "AlwaysNight". Using default (false). On map: ${map.name}`);
        if (mapProperties.AlwaysNight === true) alwaysNight = true;

        const board = new Board({
            name: map.name,
            mapData: map.data,
            alwaysNight,
        });

        if (board.alwaysNight === false) {
            board.dayPhase = this.dayPhase;
        }

        boardsArray.push(board);
        boardsObject[map.name] = board;

        return true;
    },

    /**
     * Prepares any data that a client will need to know as soon as it starts the game state.
     */
    getPlayerDataToSend(playerEntity: Player) {
        const dataToSend: PlayerData = {
            inventory: playerEntity.inventory.getEmittableProperties(),
            // bank: playerEntity.bank.getEmittableProperties(),
            boardName: playerEntity.board!.name,
            boardAlwaysNight: playerEntity.board!.alwaysNight,
            dayPhase: playerEntity.board!.dayPhase,
            player: {
                id: playerEntity.id,
                row: playerEntity.row,
                col: playerEntity.col,
                displayName: playerEntity.displayName,
                hitPoints: playerEntity.hitPoints,
                maxHitPoints: playerEntity.maxHitPoints,
                food: playerEntity.food,
                maxFood: playerEntity.maxFood,
                defence: playerEntity.defence,
                glory: playerEntity.glory,
                moveRate: playerEntity.moveRate,
            },
            // Get the things this player can see.
            dynamicsData: playerEntity.board!.getNearbyDynamicsData(
                playerEntity.row,
                playerEntity.col,
            ),
        };

        return dataToSend;
    },

    /**
     * Add a player entity to the game world from an existing player account.
     */
    addExistingPlayer(clientSocket: PlayerWebSocket, account: AccountDocument) {
        message(`World add existing player (${(new Date()).toUTCString()}):`, account.displayName);

        if (clientSocket.entity) {
            // Weird bug... :S
            warning('* * * * * adding existing player, but client socket already has an entity');
        }

        // Don't let too many players in the world.
        if (this.playerCount >= this.maxPlayers) {
            clientSocket.sendEvent('world_full');
            return;
        }

        const randomPosition: RowCol = getRandomElement(
            boardsObject[Settings.PLAYER_SPAWN_BOARD_NAME].entranceTilePositions,
        );

        const playerEntity = new (EntitiesList.BY_NAME.Player as typeof Player)({
            row: 50, // randomPosition.row,
            col: 50, // randomPosition.col,
            board: boardsObject[Settings.PLAYER_SPAWN_BOARD_NAME],
            displayName: account.displayName,
            socket: clientSocket,
        });

        loadPlayerData(playerEntity, account);

        const dataToSend = this.getPlayerDataToSend(playerEntity);

        // Tell them they are logged in.
        dataToSend.isLoggedIn = account.isLoggedIn;

        // To uniquely identify accounts on the client.
        dataToSend.accountId = account._id;

        // Tell the nearby players to add this new player, after they are fully set up (if an
        // account was loaded, the properties will have been modified after object creation).
        playerEntity.emitToNearbyPlayers();

        clientSocket.sendEvent('join_world_success', dataToSend);

        clientSocket.inGame = true;

        this.playerCount += 1;

        message('Player count:', this.playerCount);
    },

    /**
     * Add a new player entity to the game world, without an associated player account.
     * They can create an account to associate with later.
     */
    addNewPlayer(clientSocket: PlayerWebSocket, displayName: string) {
        message(`World add new player (${(new Date()).toUTCString()}):`, displayName);

        if (clientSocket.entity !== undefined) {
            // Weird bug... :S
            warning('* * * * adding new player, but client socket already has an entity');
        }

        // Don't let too many players in the world.
        if (this.playerCount >= this.maxPlayers) {
            clientSocket.sendEvent('world_full');
            return;
        }

        const randomPosition: RowCol = getRandomElement(
            boardsObject[Settings.PLAYER_SPAWN_BOARD_NAME].entranceTilePositions,
        );

        const playerEntity = new (EntitiesList.BY_NAME.Player as typeof Player)({
            row: 50, // randomPosition.row,
            col: 50, // randomPosition.col,
            board: boardsObject[Settings.PLAYER_SPAWN_BOARD_NAME],
            displayName,
            socket: clientSocket,
        });

        // New accounts get some free stuff in their inventory, so add those properties.
        playerEntity.inventory.addStarterItems();
        // New accounts get some free stuff in their bank, so add those properties.
        // playerEntity.bank.addStarterItems();

        const dataToSend = this.getPlayerDataToSend(playerEntity);

        // Tell the nearby players to add this new player, after they are fully set up.
        playerEntity.emitToNearbyPlayers();

        clientSocket.sendEvent('join_world_success', dataToSend);

        clientSocket.inGame = true;

        this.playerCount += 1;

        message('Player count:', this.playerCount);
    },

    /**
     * Remove the given player from the world and the game.
     * @param clientSocket - The socket of the player entity to remove.
     */
    removePlayer(clientSocket: PlayerWebSocket) {
        if (clientSocket.entity) {
            message(`World remove player (${(new Date()).toUTCString()}):`, clientSocket.entity.displayName);
        }

        // If the socket had an entity, remove it from the game.
        if (clientSocket.entity !== undefined) {
            // If they have an account log them out.
            if (clientSocket.account) {
                logOut(clientSocket);
            }

            clientSocket.entity?.remove();

            // Remove the reference to the player entity.
            clientSocket.entity = undefined;
        }

        if (clientSocket.inGame) {
            clientSocket.inGame = false;
            // Reduce the player count.
            this.playerCount -= 1;
        }

        message('Player count:', this.playerCount);
    },

    /**
     * Move the game day phase along one phase.
     */
    progressTime() {
        // Shuffle the time along to the next period.
        dayPhaseCycle.push(dayPhaseCycle.shift()!);

        // Utils.message("Day phase progressed:", dayPhaseCycle[0]);

        // Check if the period is different than last. Don't bother updating the boards/players if
        // it is the same. i.e. day and night last more than one phase.
        if (dayPhaseCycle[0] !== this.dayPhase) {
            // Get whatever is at the front.
            this.dayPhase = dayPhaseCycle[0];

            boardsArray.forEach((board) => {
                // Don't change the time inside dungeons and caves etc.
                // They are always dark (night).
                if (board.alwaysNight === false) {
                    board.dayPhase = this.dayPhase;
                }
            });

            // Tell the boards and everyone on them the time has changed.
            wss.broadcastToInGame('change_day_phase', this.dayPhase);
        }

        setTimeout(World.progressTime, dayPhaseRate);
    },

};

export default World;
