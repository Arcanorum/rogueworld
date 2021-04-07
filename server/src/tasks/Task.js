const EventsList = require("../EventsList");
const ItemConfig = require("../inventory/ItemConfig");
const ItemsList = require("../items/ItemsList");
const Utils = require("../Utils");

class Task {
    /**
     * @param {Player} player - The entity of the player that this task is assigned to.
     * @param {TaskType} taskType - The kind of task to track the progress of.
     * @param {Number} [progress] - How far along this task is the player already.
     * @param {Number} completionThreshold - How much progress must be made to complete this task.
     * @param {Array} rewardItemTypes - The item type class references to give.
     * @param {Number} rewardGlory - How much glory to give.
     * @param {Boolean} skipSave - Should this task not be saved to the player account. Used to avoid saving an existing
     */
    constructor(config) {
        /** @type {Player} */
        this.player = config.player;
        /** @type {TaskType} */
        this.taskType = config.taskType;
        /** @type {Array} */
        this.rewardItemTypes = config.rewardItemTypes || [];
        /** @type {Number} */
        this.rewardGlory = config.rewardGlory || 1;
        /** @type {Number} */
        this.progress = config.progress || 0;
        /** @type {Number} */
        this.completionThreshold = config.completionThreshold || 1;

        // Add this task to the player's task list.
        this.player.tasks.list[this.taskType.taskId] = this;

        const rewardItemTypeCodes = [];
        for (let i = 0; i < this.rewardItemTypes.length; i += 1) {
            rewardItemTypeCodes.push(this.rewardItemTypes[i].prototype.typeCode);
        }

        // Tell the client to add the task.
        this.player.socket.sendEvent(this.player.EventsList.task_added, {
            taskId: this.taskType.taskId,
            progress: this.progress,
            completionThreshold: this.completionThreshold,
            rewardItemTypeCodes,
            rewardGlory: this.rewardGlory,
        });

        // If this player has an account, save the new task.
        if (!config.skipSave && this.player.socket.account) {
            try {
                const taskData = {
                    taskId: this.taskType.taskId,
                    progress: this.progress,
                    completionThreshold: this.completionThreshold,
                    rewardGlory: this.rewardGlory,
                    rewardItemTypeCodes: this.rewardItemTypes.map(
                        (rewardItemType) => rewardItemType.prototype.typeCode,
                    ),
                };
                this.player.socket.account.tasks.set(this.taskType.taskId, taskData);
            }
            catch (error) {
                Utils.warning(error);
            }
        }
    }

    progressMade() {
        if (this.progress >= this.completionThreshold) return;
        this.progress += 1;
        // Tell the player they have made progress on the task.
        // The client can work out whether it has been completed.
        this.player.socket.sendEvent(
            EventsList.task_progress_made,
            {
                taskId: this.taskType.taskId,
                progress: this.progress,
            },
        );

        // If the player has an account, save their task progress.
        if (this.player.socket.account) {
            try {
                this.player.socket.account.tasks.get(this.taskType.taskId).set("progress", this.progress);
            }
            catch (error) {
                Utils.warning(error);
            }
        }
    }

    claimReward() {
        if (this.progress < this.completionThreshold) return;

        this.remove();

        // Give them the rewards.
        this.player.modGlory(this.rewardGlory);

        const { rewardItemTypes } = this;

        rewardItemTypes.forEach((ItemType) => {
            const itemConfig = new ItemConfig({ ItemType });

            if (itemConfig.quantity) {
                // If they have enough inventory space to claim at least some of this reward, add
                // to the inventory.
                if (this.player.inventory.canItemBeAdded(itemConfig)) {
                    this.player.inventory.addItem(itemConfig);
                }

                // Check there is any of the item left. Not all
                // of it might have been added to the inventory.
                // Add anything remaining to the ground.
                if (itemConfig.quantity > 0) {
                    new ItemType.prototype.PickupType(
                        {
                            row: this.player.row,
                            col: this.player.col,
                            board: this.player.board,
                            itemConfig,
                        },
                    ).emitToNearbyPlayers();
                }
            }
            else if (itemConfig.durability) {
                // If they have enough inventory space to claim this reward, add to the inventory.
                if (this.player.inventory.canItemBeAdded(itemConfig)) {
                    this.player.inventory.addItem(itemConfig);
                }
                else {
                    new ItemType.prototype.PickupType(
                        {
                            row: this.player.row,
                            col: this.player.col,
                            board: this.player.board,
                            itemConfig,
                        },
                    ).emitToNearbyPlayers();
                }
            }
        });

        // Tell the client to remove this task from the list.
        this.player.socket.sendEvent(EventsList.task_claimed, this.taskType.taskId);

        // This task has been removed, add a new one of the same type.
        new NewTask({ player: this.player, category: this.taskType.category });
    }

    remove() {
        // Remove this task from the player's task list.
        delete this.player.tasks.list[this.taskType.taskId];

        // Remove this task from their account if they are using one.
        if (this.player.socket.account) {
            try {
                this.player.socket.account.tasks.delete(this.taskType.taskId);
            }
            catch (error) {
                Utils.warning(error);
            }
        }
    }
}

class NewTask extends Task {
    /**
     * TODO: This class is just being used for it's constructor, to do some extra
     * stuff for new tasks. Maybe needs working into a method on the parent...
     * @param {Player} config.player
     * @param {Array} config.category
     */
    constructor(config) {
        // Get a random task from the list of tasks of the given category.
        const randomTaskType = Utils.getRandomElement(config.category);

        let taskTypeToUse = randomTaskType;
        // If the player already has this task, use a different one.
        if (config.player.tasks.list[randomTaskType.taskId]) {
            taskTypeToUse = config.player.tasks.list[randomTaskType.taskId].taskType.getOtherTask();
        }

        // The difficulty of the task, or how much stuff to do for it, and what rewards are given.
        const difficulty = Utils.getRandomIntInclusive(1, 3);

        const rewardItemTypes = [];

        if (difficulty === 1) {
            rewardItemTypes.push(ItemsList.BY_NAME.TinyLootBox);
        }
        else if (difficulty === 2) {
            rewardItemTypes.push(ItemsList.BY_NAME.SmallLootBox);
        }
        else {
            rewardItemTypes.push(ItemsList.BY_NAME.MediumLootBox);
        }

        super({
            player: config.player,
            taskType: taskTypeToUse,
            progress: 0,
            completionThreshold: 5 * difficulty,
            rewardItemTypes,
            rewardGlory: 500 * difficulty,
        });
    }
}

module.exports = {
    Task,
    NewTask,
};
