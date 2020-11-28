/**
 * @typedef {Function} AccountModel
 *
 * @property {String} username
 * @property {String} password
 * @property {Date} lastLogOutTime
 * @property {Boolean} isLoggedIn
 * @property {String} displayName
 * @property {Number} glory
 * @property {Array} bankItems
 * @property {Object} inventory
 * @property {Object} stats
 * @property {Object} tasks
 *
 * @param {Object} config
 */
let AccountModel;

const isSetup = false;

module.exports = {

    isShutDown: false,

    async setup() {
        // Setup should only happen once.
        if (isSetup === true) {
            Utils.warning("Attempt to setup account manager again.");
            process.exit();
            return;
        }

        this.mongoose = require("mongoose");

        await this.mongoose.connect("mongodb://localhost/accounts", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        }).catch((err) => {
            console.log("DB connect error:", err);
        });

        this.mongoose.connection.on("error", (err) => {
            console.error("DB connection error:", err);
            // Cannot connect to database, stop server init.
            process.exit();
        });

        const accountSchema = new this.mongoose.Schema({
            username: { type: String, required: true },
            password: { type: String, required: true },
            creationTime: { type: Date, default: Date.now() },
            lastLogOutTime: { type: Date, default: Date.now() },
            isLoggedIn: { type: Boolean, default: false },
            displayName: { type: String, default: "Savage" },
            glory: { type: Number, default: 0 },
            bankItems: { type: Array, default: [] },
            inventory: { type: Object, default: {} },
            stats: { type: Object, default: {} },
            tasks: { type: Object, default: {} },
        });
        // Create a unique index in the DB for the account username.
        accountSchema.index("username", { unique: true });

        AccountModel = this.mongoose.model("Account", accountSchema);

        AccountModel.ensureIndexes(function (err) {
            if (err) return console.error(err);
        });

        AccountModel.on("index", function (res, error) {
            // "_id index cannot be sparse"
            console.log("DB index res:", res);
            console.log("DB index error:", error);
        });

        // Testing document.
        // const newAcc = new AccountModel({
        //     username: "",
        //     displayName: "",
        //     password: ""
        // });
        //
        // newAcc.save();

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

        const acc = new AccountModel({
            username: username,
            password: password,
            isLoggedIn: true,
            displayName: formattedData.displayName,
            glory: formattedData.glory,
            bankItems: formattedData.bankItems,
            inventory: formattedData.inventory,
            stats: formattedData.stats,
            tasks: formattedData.tasks
        });

        await acc.save()
            .then((res) => {
                onSuccess(res);
            })
            .catch((error) => {
                onFailure(error);
            });
    },

    /**
     * Log a player account in.
     * @param {Object} clientSocket
     * @param {String} username
     * @param {String} password
     * @param {Function} onSuccess
     */
    logIn(clientSocket, username, password, onSuccess) {
        AccountModel.findOne({ username: username })
            .then(async (res) => {
                // If a document by the given username was NOT found, res will be null.
                if (!res) return;

                // Prevent them from logging into an account that is already logged in.
                if (res.isLoggedIn === true) {
                    clientSocket.sendEvent(EventsList.something_went_wrong);
                    return;
                }

                if (res.password === password) {
                    // Success.
                    res.isLoggedIn = true;

                    await res.save();

                    onSuccess(res);
                }
                // Password is incorrect.
                else {
                    clientSocket.sendEvent(EventsList.invalid_login_details);
                }
            })
            .catch((err) => {
                Utils.message("Account manager, log in error:", err);
                // Failure.
                clientSocket.sendEvent(EventsList.something_went_wrong);
            });
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
        const bankItems = account.bankItems;
        for (let i = 0, len = bankItems.length; i < len; i += 1) {
            // Check the type of item to add is valid. Might have been removed (or renamed) since this player last logged in. Also checks for null.
            if (ItemsList[bankItems[i].itemTypeName] === undefined) {
                continue;
            }

            entity.bankAccount.addItemToBankAccount(
                i,
                ItemsList[bankItems[i].itemTypeName], // BankAccount.addItemToBankAccount wants the TYPE itself, not just the type name.
                bankItems[i].durability,
                bankItems[i].maxDurability
            );
        }

        // Inventory.
        const inventory = account.inventory;
        for (let slotKey in inventory) {
            if (inventory.hasOwnProperty(slotKey) === false) continue;
            // Check the type of item to add is valid. Might have been removed (or renamed) since this player last logged in. Also checks for null.
            if (ItemsList[inventory[slotKey].itemTypeName] === undefined) continue;

            entity.addToInventory(new ItemsList[inventory[slotKey].itemTypeName]({
                durability: inventory[slotKey].durability,
                maxDurability: inventory[slotKey].maxDurability
            }));
        }

        // Stats exp.
        const statsExp = account.stats;
        for (let statKey in entity.stats) {
            if (entity.stats.hasOwnProperty(statKey) === false) continue;
            // Check the account has exp data on that stat. A new stat might have been added to
            // the stat set since this player last logged in, so they won't have an entry for it.
            if (statsExp[statKey] === undefined) continue;
            // Get the exp for each stat that this account has data on.
            entity.stats[statKey].exp = statsExp[statKey];
            entity.stats[statKey].calculateCurrentLevel();
        }

        // Tasks.
        // Catch the case that no existing task progresses were loaded successfully, so they at least have the starting ones.
        let addStartingTasks = true;
        const savedTasks = account.tasks;

        for (let savedTaskKey in savedTasks) {
            if (savedTasks.hasOwnProperty(savedTaskKey) === false) continue;
            // Check the type of task to add is valid.
            // Might have been removed (or renamed) since this player last logged in.
            if (TaskTypes[savedTaskKey] === undefined) continue;

            const taskData = savedTasks[savedTaskKey];
            // Check the task has a list of reward item types. Might be malformed data.
            if (taskData.rewardItemTypeNames === undefined) continue;
            const rewardItemTypes = [];
            for (let i = 0; i < taskData.rewardItemTypeNames.length; i += 1) {
                // Check the item to add still exists.
                // Might have been removed (or renamed) since this player last logged in.
                if (ItemsList[taskData.rewardItemTypeNames[i]] === undefined) {
                    // Add something else instead to compensate.
                    rewardItemTypes.push(Utils.getRandomElement(RewardsList));
                    continue;
                };

                rewardItemTypes.push(ItemsList[taskData.rewardItemTypeNames[i]]);
            }

            new Task.Task(entity, TaskTypes[savedTaskKey], taskData.progress, taskData.completionThreshold, rewardItemTypes, taskData.rewardGlory);

            // Assume everything is ok.
            addStartingTasks = false;
        }

        // If they don't have enough tasks for whatever reason, give them the starting ones.
        if (Object.keys(entity.tasks.list).length < 6) {
            addStartingTasks = true;
        }

        // The owner has no task progress so far, give them the starting tasks.
        if (addStartingTasks === true) entity.tasks.addStartingTasks();
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
        for (let clientSocket of wss.clients) {
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
        }

        try {
            // Write the data to a temporary local file.

            // TODO: potential problem here where if there is a problem in PlayerDataDumpHandler
            //  and so the temp data isn't deleted, but then the server starts again and closes
            //  again, so will overwrite this existing temp file from last time.
            fs.writeFileSync("./PlayerDataDump.json", JSON.stringify(dataToSave));

            // Create a new process
            const spawn = require("child_process").spawn;
            const child = spawn("node", ["./PlayerDataDumpHandler.js"], {
                shell: true,
                detached: true // Decouple the new process from the this one, so it can keep running after this one closes.
            });

            child.unref();

        } catch (err) {
            console.log("Error writing PlayerDataDump.json:" + err.message);
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
         * Type names are fine. i.e. "IronSword"
         */
        const data = {};

        data.displayName = entity.displayName || "Savage";

        data.glory = entity.glory;

        // Bank.
        data.bankItems = entity.bankAccount.items.map((bankItem) => {
            return {
                // Item type name.
                itemTypeName: bankItem.itemTypeName,
                // Durability.
                durability: bankItem.durability,
                // Max durability.
                maxDurability: bankItem.maxDurability
            };
        });

        // Inventory.
        data.inventory = {};
        for (let slotKey in entity.inventory) {
            if (entity.inventory.hasOwnProperty(slotKey) === false) continue;
            // Skip empty (null) slots.
            if (entity.inventory[slotKey] === null) continue;
            data.inventory[slotKey] = {
                // TODO: save by unique/unchanging item codes here, instead of class name, too brittle
                // Item type name.
                itemTypeName: entity.inventory[slotKey].typeName,
                // Durability.
                durability: entity.inventory[slotKey].durability,
                // Max durability.
                maxDurability: entity.inventory[slotKey].maxDurability
            }
        }

        // Stats exp.
        data.stats = {};
        for (let statKey in entity.stats) {
            if (entity.stats.hasOwnProperty(statKey) === false) continue;
            data.stats[statKey] = entity.stats[statKey].exp;
        }

        // Tasks.
        data.tasks = {};
        const tasksList = entity.tasks.list;
        for (let taskKey in tasksList) {
            if (tasksList.hasOwnProperty(taskKey) === false) continue;
            /** @type {Task} */
            const task = tasksList[taskKey];
            // Can't save the class references, so save the class names.
            const itemTypes = task.rewardItemTypes.map((rewardItemType) => {
                return rewardItemType.prototype.typeName;
            });
            data.tasks[taskKey] = {
                taskID: task.taskType.taskID,
                progress: task.progress,
                completionThreshold: task.completionThreshold,
                rewardGlory: task.rewardGlory,
                rewardItemTypeNames: itemTypes,
            };
        }

        return data;
    }
};

const ItemsList = require("./ItemsList");
const Task = require("./tasks/Task");
const TaskTypes = require("./tasks/TaskTypes");
const RewardsList = require("./tasks/RewardsList");
const EventsList = require("./EventsList");
const Utils = require("./Utils");
const fs = require("fs");