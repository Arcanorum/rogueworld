import { Settings } from '@dungeonz/configs';
import { DayPhases, ObjectOfUnknown, RowCol } from '@dungeonz/types';
import { getRandomElement, message, warning } from '@dungeonz/utils';
import { AccountDocument, AccountManager } from '../account';
import Player from '../entities/classes/Player';
import EntitiesList from '../entities/EntitiesList';
import PlayerWebSocket from '../websocket_events/PlayerWebSocket';
import { boardsObject } from './BoardsList';

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

    init() {
        message('Starting game world.');
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

        /** @type {Player} */
        const playerEntity = new (EntitiesList.BY_NAME.Player as typeof Player)({
            row: randomPosition.row,
            col: randomPosition.col,
            board: boardsObject[Settings.PLAYER_SPAWN_BOARD_NAME],
            displayName: account.displayName,
            socket: clientSocket,
        });

        AccountManager.loadPlayerData(playerEntity, account);

        const dataToSend = this.getPlayerDataToSend(playerEntity);

        // Tell them they are logged in.
        dataToSend.isLoggedIn = true;

        // To uniquely identify accounts on the client.
        dataToSend.accountId = account._id;

        // Tell the nearby players to add this new player, after they are full set up (if an account was loaded, the properties will have been modified after object creation).
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

        /** @type {Player} */
        const playerEntity = new (EntitiesList.BY_NAME.Player as typeof Player)({
            row: randomPosition.row,
            col: randomPosition.col,
            board: boardsObject[Settings.PLAYER_SPAWN_BOARD_NAME],
            displayName,
            socket: clientSocket,
        });

        // New accounts get some free stuff in their inventory, so add those properties.
        playerEntity.inventory.addStarterItems();
        // New accounts get some free stuff in their bank, so add those properties.
        // playerEntity.bank.addStarterItems();

        const dataToSend = this.getPlayerDataToSend(playerEntity);

        // Tell the nearby players to add this new player, after they are full set up (if an account was loaded, the properties will have been modified after object creation).
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
                AccountManager.logOut(clientSocket);
            }

            clientSocket.entity?.remove();
            // Remove the reference to the player entity.
            clientSocket.entity = null;
        }

        if (clientSocket.inGame) {
            clientSocket.inGame = false;
            // Reduce the player count.
            this.playerCount -= 1;
        }

        message('Player count:', this.playerCount);
    },

};

export default World;
