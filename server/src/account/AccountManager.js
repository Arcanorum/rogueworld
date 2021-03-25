const fs = require("fs");
const mongoose = require("mongoose");
const AccountModel = require("./AccountModel");

const ItemsList = require("../ItemsList");
const Task = require("../tasks/Task");
const TaskTypes = require("../tasks/TaskTypes");
const RewardsList = require("../tasks/RewardsList");
const EventsList = require("../EventsList");
const Utils = require("../Utils");

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
            inventory: formattedData.inventory,
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
            const account = await AccountModel.findOne({ username: clientSocket.accountUsername });

            // Check the current password matches what they claim it is.
            if (account.password !== currentPassword) {
                clientSocket.sendEvent(EventsList.change_password_failure, { messageID: "Incorrect current password" });
                return;
            }

            // Update the password.
            await AccountModel.findByIdAndUpdate(
                account._id,
                { password: newPassword },
            );

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
        if (!clientSocket.accountUsername) return;

        const formattedData = this.getFormattedSaveData(clientSocket.entity);

        await AccountModel.findOne({ username: clientSocket.accountUsername })
            .then(async (res) => {
                // If a document by the given username was NOT found, res will be null.
                if (!res) return;

                res.lastLogOutTime = Date.now();
                res.isLoggedIn = false;
                res.displayName = formattedData.displayName;
                res.glory = formattedData.glory;
                res.bankItems = formattedData.bankItems;
                res.inventory = formattedData.inventory;
                res.stats = formattedData.stats;
                res.tasks = formattedData.tasks;

                await res.save();
            })
            .catch((err) => {
                Utils.message("Account manager, log out error:", err);
                // Failure.
                clientSocket.sendEvent(EventsList.something_went_wrong);
            });
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

        // const { bankItems } = account;

        // bankItems.forEach((bankItem, i) => {
        //     // Check the type of item to add is valid.
        //     // Might have been removed since this player last logged in.
        //     if (!ItemsList.BY_CODE[bankItem.itemTypeCode]) {
        //         return;
        //     }

        //     entity.bank.addItemToBankAccount(
        //         i,
        //         ItemsList.BY_CODE[bankItem.itemTypeCode], // BankAccount.addItemToBankAccount wants the TYPE itself, not just the type code.
        //         bankItem.durability,
        //         bankItem.maxDurability,
        //     );
        // });

        // Inventory.
        const { inventory } = account;
        Object.values(inventory).forEach((itemSlot) => {
            // Check the type of item to add is valid. Might have been removed (or renamed) since this player last logged in.
            if (!ItemsList.BY_CODE[itemSlot.itemTypeCode]) return;

            entity.addToInventory(new ItemsList.BY_CODE[itemSlot.itemTypeCode]({
                durability: itemSlot.durability,
                maxDurability: itemSlot.maxDurability,
            }));
        });

        // Stats exp.
        const statsExp = account.stats;
        Object.entries(entity.stats).forEach(([statKey, stat]) => {
            // Check the account has exp data on that stat. A new stat might have been added to
            // the stat set since this player last logged in, so they won't have an entry for it.
            // Allow 0.
            if (!Number.isFinite(statsExp[statKey])) return;
            // Get the exp for each stat that this account has data on.
            stat.exp = statsExp[statKey];
            stat.calculateCurrentLevel();
        });

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
     * Log out all player accounts that are currently logged in.
     * Called on server shut down, either intentionally (restart for update) or crash.
     * This will write the savable data of all connected players to a temporary local
     * file, as DB writes (which are async) cannot finish after process exit.
     * That local store of player data is then used to update the DB in a new process,
     * where it should be deleted if all of the updates were successful.
     * @param {Object} wss
     */
    saveAllPlayersData(wss) {
        const dataToSave = [];
        // Each connected client.
        wss.clients.forEach((clientSocket) => {
            // Skip clients that are not yet fully connected.
            if (clientSocket.readyState !== 1) return;
            // Skip clients that are not in game.
            if (clientSocket.inGame === false) return;
            // Only log out clients that have an account username set.
            if (clientSocket.accountUsername) {
                const playerData = this.getFormattedSaveData(clientSocket.entity);
                // Add the username of the account this data belongs to, so the
                // dump handler can find their document in the accounts DB.
                playerData.accountUsername = clientSocket.accountUsername;
                dataToSave.push(playerData);
            }
        });

        try {
            // Write the data to a temporary local file.

            // TODO: potential problem here where if there is a problem in PlayerDataDumpHandler
            //  and so the temp data isn't deleted, but then the server starts again and closes
            //  again, so will overwrite this existing temp file from last time.
            fs.writeFileSync("./PlayerDataDump.json", JSON.stringify(dataToSave));

            // Create a new process
            // eslint-disable-next-line global-require
            const { spawn } = require("child_process");
            const child = spawn("node", ["./PlayerDataDumpHandler.js"], {
                shell: true,
                detached: true, // Decouple the new process from the this one, so it can keep running after this one closes.
            });

            child.unref();
        }
        catch (err) {
            Utils.message("Error writing PlayerDataDump.json: ", err.message);
        }

        Utils.message("Logged in players account data saved.");
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
        data.bankItems = entity.bank.items.map((bankItem) => ({
            itemTypeCode: bankItem.itemTypeCode,
            quantity: bankItem.quantity,
            durability: bankItem.durability,
            maxDurability: bankItem.maxDurability,
        }));

        // Inventory.
        data.inventory = {};
        // for (const slotKey in entity.inventory) {
        //     if (entity.inventory.hasOwnProperty(slotKey) === false) continue;
        //     // Skip empty (null) slots.
        //     if (entity.inventory[slotKey] === null) continue;
        //     data.inventory[slotKey] = {
        //         // TODO: save by unique/unchanging item codes here, instead of class name, too brittle
        //         // Item type name.
        //         itemTypeName: entity.inventory[slotKey].typeName,
        //         // Durability.
        //         durability: entity.inventory[slotKey].durability,
        //         // Max durability.
        //         maxDurability: entity.inventory[slotKey].maxDurability,
        //     };
        // }

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
