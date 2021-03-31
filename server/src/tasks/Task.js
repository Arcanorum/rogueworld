const EventsList = require("../EventsList");
const ItemConfig = require("../inventory/ItemConfig");
const ItemsList = require("../ItemsList");
const Utils = require("../Utils");

class Task {
    /**
     * @param {Player} player - The entity of the player that this task is assigned to.
     * @param {TaskType} taskType - The kind of task to track the progress of.
     * @param {Number} [progress] - How far along this task is the player already.
     * @param {Number} completionThreshold - How much progress must be made to complete this task.
     * @param {Array} rewardItemTypes - The item type class references to give.
     * @param {Number} rewardGlory - How much glory to give.
     */
    constructor(player, taskType, progress, completionThreshold, rewardItemTypes, rewardGlory) {
        /** @type {Player} */
        this.player = player;
        /** @type {TaskType} */
        this.taskType = taskType;
        /** @type {Boolean} */
        this.completed = false;
        /** @type {Array} */
        this.rewardItemTypes = rewardItemTypes || [];
        /** @type {Number} */
        this.rewardGlory = rewardGlory || 1;
        /** @type {Number} */
        this.progress = progress || 0;
        /** @type {Number} */
        this.completionThreshold = completionThreshold || 1;
        // Check this task is completed. They might have completed it before, but not claimed it.
        if (this.progress >= this.completionThreshold) {
            this.completed = true;
        }
        // Add this task to the player's task list.
        player.tasks.list[taskType.taskID] = this;

        const rewardItemTypeCodes = [];
        for (let i = 0; i < rewardItemTypes.length; i += 1) {
            rewardItemTypeCodes.push(rewardItemTypes[i].prototype.typeCode);
        }

        // Tell the client to add the task.
        player.socket.sendEvent(player.EventsList.task_added, {
            taskID: taskType.taskID,
            progress: this.progress,
            completionThreshold: this.completionThreshold,
            rewardItemTypeCodes,
            rewardGlory: this.rewardGlory,
        });
    }

    progressMade() {
        if (this.completed === true) return;
        this.progress += 1;
        // Tell the player they have made progress on the task.
        // The client can work out whether it has been completed.
        this.player.socket.sendEvent(
            EventsList.task_progress_made,
            {
                taskID: this.taskType.taskID,
                progress: this.progress,
            },
        );

        if (this.progress >= this.completionThreshold) {
            this.completed = true;
        }

        // if (this.player.sockets.account) {
        //     this.player.socket.account.tasks[]
        // }
    }

    claimReward() {
        if (this.completed === false) return;

        // Remove this task from the player's task list.
        delete this.player.tasks.list[this.taskType.taskID];

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
        this.player.socket.sendEvent(EventsList.task_claimed, this.taskType.taskID);

        // This task has been removed, add a new one of the same type.
        new NewTask(this.player, this.taskType.category);
    }
}

class NewTask extends Task {
    /**
     * TODO: This class is just being used for it's constructor, to do some extra
     * stuff for new tasks. Maybe needs working into a method on the parent...
     * @param {Player} player
     * @param {Array} category
     */
    constructor(player, category) {
        // Get a random task from the list of tasks of the given category.
        const randomTaskType = Utils.getRandomElement(category);

        let taskTypeToUse = randomTaskType;
        // If the player already has this task, use a different one.
        if (player.tasks.list[randomTaskType.taskID]) {
            taskTypeToUse = player.tasks.list[randomTaskType.taskID].getOtherTask();
        }

        // The difficulty of the task, or how much stuff to do for it, and what rewards are given.
        const difficulty = Utils.getRandomIntInclusive(1, 3);

        const rewardItems = [];

        if (difficulty === 1) {
            rewardItems.push(ItemsList.BY_NAME.TinyLootBox);
        }
        else if (difficulty === 2) {
            rewardItems.push(ItemsList.BY_NAME.SmallLootBox);
        }
        else {
            rewardItems.push(ItemsList.BY_NAME.MediumLootBox);
        }

        super(
            player,
            taskTypeToUse,
            0,
            5 * difficulty,
            rewardItems,
            500 * difficulty,
        );
    }
}

module.exports = {
    Task,
    NewTask,
};
