const mongoose = require("mongoose");
const AccountModel = require("./AccountModel");
const ItemsList = require("../ItemsList");
const Task = require("../tasks/Task");
const TaskTypes = require("../tasks/TaskTypes");
const RewardsList = require("../tasks/RewardsList");
const EventsList = require("../EventsList");
const Utils = require("../Utils");

// mongoose.set("debug", true);

const isSetup = false;

module.exports = {

    isShutDown: false,

    async setup() {
        // Setup should only happen once.
        if (isSetup === true) {
            Utils.warning("Attempt to setup account manager again.");
            process.exit();
        }

        await mongoose.connect("mongodb://localhost/dungeonzDB", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        }).catch((err) => {
            Utils.warning("DB connect error:", err);
        });

        mongoose.connection.on("error", (err) => {
            Utils.warning("DB connection error:", err);
            // Cannot connect to database, stop server init.
            process.exit();
        });

        AccountModel.ensureIndexes((err) => {
            Utils.message("ensuring indexes:", err);
            if (err) return Utils.error(err);
            return true;
        });

        AccountModel.on("index", (res, error) => {
            // "_id index cannot be sparse"
            Utils.message("DB index res:", res);
            Utils.message("DB index error:", error);
        });

        // Log out all of the accounts, in case they were logged in the last time the server shut down,
        // otherwise some players will not be able to log in as their accounts are already logged in.
        await AccountModel.updateMany({}, { isLoggedIn: false });
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
                // Success.
                account.isLoggedIn = true;

                await account.save();

                // Save the Mongoose document instance on the player account for faster
                // operations, instead of doing a .findOne by username every time.
                // Also helps avoid concurrency issues.
                clientSocket.account = account;

                onSuccess(account);
            }
            // Password is incorrect.
            else {
                clientSocket.sendEvent(EventsList.invalid_login_details);
            }
        }
        catch (error) {
            Utils.message("Account manager, log in error:", error);
            clientSocket.sendEvent(EventsList.something_went_wrong);
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
            // const formattedData = this.getFormattedSaveData(clientSocket.entity);

            clientSocket.account.lastLogOutTime = Date.now();
            clientSocket.account.isLoggedIn = false;
            // clientSocket.account.displayName = formattedData.displayName;
            // clientSocket.account.glory = formattedData.glory;
            // clientSocket.account.bankItems = formattedData.bankItems;
            // clientSocket.account.inventoryItems = formattedData.inventoryItems;
            // clientSocket.account.stats = formattedData.stats;
            // clientSocket.account.tasks = formattedData.tasks;

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
        Object.entries(account.tasks).forEach(([savedTaskKey, savedTask]) => {
            // Check the type of task to add is valid.
            // Might have been removed (or renamed) since this player last logged in.
            if (!TaskTypes[savedTaskKey]) return;

            // Check the task has a list of reward item types. Might be malformed data.
            if (!savedTask.rewardItemTypeCodes) return;

            const rewardItemTypes = savedTask.rewardItemTypeCodes.map((rewardItemTypeCode) => {
                // Check the item to add still exists.
                // Might have been removed since this player last logged in.
                if (ItemsList.BY_CODE[rewardItemTypeCode] === undefined) {
                    // Add something else instead to compensate.
                    return Utils.getRandomElement(RewardsList);
                }

                return ItemsList.BY_CODE[rewardItemTypeCode];
            });

            new Task.Task(
                entity,
                TaskTypes[savedTaskKey],
                savedTask.progress,
                savedTask.completionThreshold,
                rewardItemTypes,
                savedTask.rewardGlory,
            );
        });

        // Catch the case that no existing task progresses were loaded successfully, so they at least have the starting ones.
        // If they don't have enough tasks for whatever reason, give them the starting ones.
        if (Object.keys(entity.tasks.list).length < 6) {
            // The owner has no task progress so far, give them the starting tasks.
            entity.tasks.addStartingTasks();
        }
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
        data.bankItems = entity.bank.items.map((item) => ({
            typeCode: item.ItemType.prototype.typeCode,
            quantity: item.quantity,
            durability: item.durability,
            maxDurability: item.maxDurability,
        }));

        // Inventory.
        data.inventoryItems = entity.inventory.items.map((item) => ({
            typeCode: item.itemConfig.ItemType.prototype.typeCode,
            quantity: item.itemConfig.quantity,
            durability: item.itemConfig.durability,
            maxDurability: item.itemConfig.maxDurability,
        }));

        // Stats exp.
        data.stats = {};
        Object.entries(entity.stats).forEach(([statKey, stat]) => {
            data.stats[statKey] = stat.exp;
        });

        // Tasks.
        data.tasks = {};
        Object.entries(entity.tasks.list).forEach(([taskKey, task]) => {
            data.tasks[taskKey] = {
                taskID: task.taskType.taskID,
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
