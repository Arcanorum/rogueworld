import mongoose, { Document, Error } from 'mongoose';
import AccountModel, { AccountDocument, ItemDocument } from './AccountModel';
import World from '../space/World';
import { error, message, warning } from '@dungeonz/utils';
import { Settings } from '@dungeonz/configs';
import Player from '../entities/classes/Player';
import PlayerWebSocket from '../websocket_events/PlayerWebSocket';

// mongoose.set("debug", true);

let isSetup = false;

interface FormattedSaveData {
    displayName: string;
    glory: number;
    // bankItems: [];
    inventoryItems: Array<ItemDocument>;
}

export default {

    // world: null,

    isShutDown: false,

    async setup(/*world: World*/) {
        // this.world = world;

        // Setup should only happen once.
        if (isSetup) error('Attempt to setup account manager again.');

        try {
            await mongoose.connect('mongodb://localhost/dungeonzDB', {
                serverSelectionTimeoutMS: 2000,
            });

            message('Connected to database.');

            try {
                // Log out all of the accounts, in case they were logged in the last time the server shut down,
                // otherwise some players will not be able to log in as their accounts are already logged in.
                await AccountModel.updateMany({}, { isLoggedIn: false });
            }
            catch (err) {
                error('Error while logging out all player accounts:', err);
            }

            mongoose.connection.on('error', (err) => {
                // DB connection issue after connection established.
                error('DB connection error:', err);
            });
        }
        catch (err) {
            // Allow starting the server without a DB connection in dev mode.
            if (Settings.DEV_MODE) {
                warning('Cannot connect to database. Starting without persistent features. Account creation/saving will not work!');
            }
            else {
                // In prod mode. Fail here to figure out what is wrong with the DB connection.
                error('Cannot connect to database:', err);
            }
        }

        isSetup = true;
    },

    async createAccount(
        username: string,
        password: string,
        entity: Player,
        onSuccess: (response: Document) => void,
        onFailure: (error: NodeJS.ErrnoException) => void,
    ) {
        const formattedData = this.getFormattedSaveData(entity);

        const account = new AccountModel({
            username,
            password,
            isLoggedIn: true,
            displayName: formattedData.displayName,
            glory: formattedData.glory,
            // bankItems: formattedData.bankItems,
            inventoryItems: formattedData.inventoryItems,
        });

        await account.save()
            .then((res: Document) => {
                if(!entity.socket) {
                    error('Account save success, but entity.socket is somehow undefined.');
                    return;
                }
                // Player is now logged into their newly created account, so attach it to them as if they
                // have logged in normally so they can have their progress saved.
                entity.socket.account = account;

                onSuccess(res);
            })
            .catch((err: Error) => {
                onFailure(err);
            });
    },

    async changePassword(
        clientSocket: PlayerWebSocket,
        currentPassword: string,
        newPassword: string,
    ) {
        try {
            const { account } = clientSocket;

            if(!account) {
                clientSocket.sendEvent('change_password_failure', { messageId: 'Something went wrong' });
                return;
            }

            // Check the current password matches what they claim it is.
            if (account.password !== currentPassword) {
                clientSocket.sendEvent('change_password_failure', { messageId: 'Incorrect current password' });
                return;
            }

            // Update the password.
            account.password = newPassword;

            await account.save();

            clientSocket.sendEvent('change_password_success');
        }
        catch (err) {
            message('Change password error:', err);
            clientSocket.sendEvent('change_password_failure', { messageId: 'Something went wrong' });
        }
    },

    /**
     * Log a player account in.
     */
    async logIn(
        clientSocket: PlayerWebSocket,
        username: string,
        password: string,
        onSuccess: (account: AccountDocument) => void,
    ) {
        try {
            const account = await AccountModel.findOne({ username });

            if (!account) {
                // Account document doesn't exist.
                clientSocket.sendEvent('invalid_login_details');
                return;
            }

            // Prevent them from logging into an account that is already logged in.
            if (account.isLoggedIn === true) {
                clientSocket.sendEvent('already_logged_in');
                return;
            }

            if (account.password === password) {
                // Save the Mongoose document instance on the player account for faster
                // operations, instead of doing a .findOne by username every time.
                // Also helps avoid concurrency issues.
                clientSocket.account = account;

                onSuccess(account);

                // Successfully loaded the player. Ok to mark them as logged in now.
                account.isLoggedIn = true;

                await account.save();
            }
            // Password is incorrect.
            else {
                clientSocket.sendEvent('invalid_login_details');
            }
        }
        catch (error) {
            message('Account manager, log in error:', error);
            clientSocket.sendEvent('something_went_wrong');

            // Make sure they get removed from the game world so their character isn't just stood
            // there.
            World.removePlayer(clientSocket);
        }
    },

    /**
     * Updates the data of an account in the accounts DB.
     * Happens when a player logs out or closes the game.
     */
    async logOut(clientSocket: PlayerWebSocket) {
        if (!clientSocket) return;
        if (!clientSocket.entity) return;
        if (!clientSocket.account) return;

        try {
            clientSocket.account.lastLogOutTime = Date.now();
            clientSocket.account.isLoggedIn = false;

            await clientSocket.account.save();
        }
        catch (err) {
            message('Account manager, log out error:', err);
            // Failure.
            clientSocket.sendEvent('something_went_wrong');
        }
    },

    /**
     * Load the data from the given account into the entity of the player.
     */
    loadPlayerData(entity: Player, account: AccountDocument) {
        entity.displayName = account.displayName;
        // Round down, in case they were somehow decimals.
        entity.glory = Math.floor(account.glory);

        // Bank.
        // entity.bank.loadData(account);

        // Inventory.
        entity.inventory.loadData(account);
    },

    /**
     * Creates an object with all of the relevant data from a player entity to be saved in the Accounts DB.
     * @returns The formatted data object.
     */
    getFormattedSaveData(entity: Player) {
        /**
         * DO NOT SAVE TYPE NUMBERS OF ANY KIND, AS THEY WILL CHANGE BETWEEN BUILDS AS THINGS ARE ADDED.
         * Type codes are fine, as they should never change. i.e. "ABCD1234"
         */
        const data: FormattedSaveData = {
            displayName: entity.displayName || 'Savage',
            glory: entity.glory,
            // bankItems: entity.bank.getSaveData(),
            inventoryItems: entity.inventory.getSaveData(),
        };

        return data;
    },
};
