const mongoose = require("mongoose");
const AccountModel = require("./AccountModel");
const EventsList = require("../EventsList");
const Utils = require("../Utils");
const settings = require("../../settings");

// mongoose.set("debug", true);

const isSetup = false;

module.exports = {

    world: null,

    isShutDown: false,

    async setup(world) {
        this.world = world;

        // Setup should only happen once.
        if (isSetup === true) {
            Utils.error("Attempt to setup account manager again.");
        }

        try {
            await mongoose.connect("mongodb://localhost/dungeonzDB", {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
                serverSelectionTimeoutMS: 2000,
            });

            Utils.message("Connected to database.");

            try {
                // Log out all of the accounts, in case they were logged in the last time the server shut down,
                // otherwise some players will not be able to log in as their accounts are already logged in.
                await AccountModel.updateMany({}, { isLoggedIn: false });
            }
            catch (error) {
                Utils.error("Error while logging out all player accounts:", error);
            }

            mongoose.connection.on("error", (err) => {
                // DB connection issue after connection established.
                Utils.error("DB connection error:", err);
            });
        }
        catch (error) {
            // Allow starting the server without a DB connection in dev mode.
            if (settings.DEV_MODE) {
                Utils.warning("Cannot connect to database. Starting without persistent features. Account creation/saving will not work!");
            }
            else {
                // In prod mode. Fail here to figure out what is wrong with the DB connection.
                Utils.error("Cannot connect to database:", error);
            }
        }
    },

    /**
     *
     * @param {String} username
     * @param {String} password
     * @param {Player} entity
     * @param {Function} onSuccess
     * @param {Function} onFailure
     * @returns {Promise<void>}
     */
    async createAccount(username, password, entity, onSuccess, onFailure) {
        const formattedData = this.getFormattedSaveData(entity);

        const account = new AccountModel({
            username,
            password,
            isLoggedIn: true,
            displayName: formattedData.displayName,
            glory: formattedData.glory,
            bankItems: formattedData.bankItems,
            inventoryItems: formattedData.inventoryItems,
            stats: formattedData.stats,
            tasks: formattedData.tasks,
        });

        await account.save()
            .then((res) => {
                // Player is now logged into their newly created account, so attach it to them as if they
                // have logged in normally so they can have their progress saved.
                entity.socket.account = account;

                onSuccess(res);
            })
            .catch((error) => {
                onFailure(error);
            });
    },

    async changePassword(clientSocket, currentPassword, newPassword) {
        try {
            const { account } = clientSocket;

            // Check the current password matches what they claim it is.
            if (account.password !== currentPassword) {
                clientSocket.sendEvent(EventsList.change_password_failure, { messageID: "Incorrect current password" });
                return;
            }

            // Update the password.
            account.password = newPassword;

            await account.save();

            clientSocket.sendEvent(EventsList.change_password_success);
        }
        catch (error) {
            Utils.message("Change password error:", error);
            clientSocket.sendEvent(EventsList.change_password_failure, { messageID: "Something went wrong" });
        }
    },

    /**
     * Log a player account in.
     * @param {Object} clientSocket
     * @param {String} username
     * @param {String} password
     * @param {Function} onSuccess
     */
    async logIn(clientSocket, username, password, onSuccess) {
        try {
            const account = await AccountModel.findOne({ username });

            if (!account) {
                // Account document doesn't exist.
                clientSocket.sendEvent(EventsList.invalid_login_details);
                return;
            }

            // Prevent them from logging into an account that is already logged in.
            if (account.isLoggedIn === true) {
                clientSocket.sendEvent(EventsList.already_logged_in);
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
                clientSocket.sendEvent(EventsList.invalid_login_details);
            }
        }
        catch (error) {
            Utils.message("Account manager, log in error:", error);
            clientSocket.sendEvent(EventsList.something_went_wrong);

            // Make sure they get removed from the game world so their character isn't just stood
            // there.
            this.world.removePlayer(clientSocket);
        }
    },

    /**
     * Updates the data of an account in the accounts DB.
     * Happens when a player logs out or closes the game.
     * @param {Object} clientSocket
     */
    async logOut(clientSocket) {
        if (!clientSocket) return;
        if (!clientSocket.entity) return;
        if (!clientSocket.account) return;

        try {
            clientSocket.account.lastLogOutTime = Date.now();
            clientSocket.account.isLoggedIn = false;

            await clientSocket.account.save();
        }
        catch (err) {
            Utils.message("Account manager, log out error:", err);
            // Failure.
            clientSocket.sendEvent(EventsList.something_went_wrong);
        }
    },

    /**
     * Load the data from the given account into the entity of the player.
     * @param {Player} entity
     * @param {AccountModel} account
     */
    loadPlayerData(entity, account) {
        entity.displayName = account.displayName;
        // Round down, in case they were somehow decimals.
        entity.glory = Math.floor(account.glory);

        // Bank.
        entity.bank.loadData(account);

        // Inventory.
        entity.inventory.loadData(account);

        // Stats exp.
        entity.stats.loadData(account);

        // Tasks.
        entity.tasks.loadData(account);
    },

    /**
     * Creates an object with all of the relevant data from a player entity to be saved in the Accounts DB.
     * @param {Player} entity
     * @returns {Object} The formatted data object.
     */
    getFormattedSaveData(entity) {
        /**
         * DO NOT SAVE TYPE NUMBERS OF ANY KIND, AS THEY WILL CHANGE BETWEEN BUILDS AS THINGS ARE ADDED.
         * Type codes are fine, as they should never change. i.e. "ABCD1234"
         */
        const data = {};

        data.displayName = entity.displayName || "Savage";

        data.glory = entity.glory;

        // Bank.
        data.bankItems = entity.bank.getSaveData();

        // Inventory.
        data.inventoryItems = entity.inventory.getSaveData();

        // Stats exp.
        data.stats = {};
        Object.entries(entity.stats).forEach(([statKey, stat]) => {
            data.stats[statKey] = stat.exp;
        });

        // Tasks.
        data.tasks = {};
        Object.entries(entity.tasks.list).forEach(([taskKey, task]) => {
            data.tasks[taskKey] = {
                taskId: task.taskType.taskId,
                progress: task.progress,
                completionThreshold: task.completionThreshold,
                rewardGlory: task.rewardGlory,
                // Can't save the class references, so save the codes.
                rewardItemTypeCodes: task.rewardItemTypes.map(
                    (rewardItemType) => rewardItemType.prototype.typeCode,
                ),
            };
        });

        return data;
    },
};
