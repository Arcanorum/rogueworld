const EventsList = require("./../EventsList");
const Utils = require("../Utils");
const RewardsList = require("./RewardsList");

class Task {
    /**
     * @param {Player} player - The entity of the player that this task is assigned to.
     * @param {TaskType} taskType - The kind of task to track the progress of.
     * @param {Number} [progress] - How far along this task is the player already.
     * @param {Number} completionThreshold - How much progress must be made to complete this task.
     * @param {Array} rewardItemTypes - The item type class references to give.
     * @param {Number} rewardGlory - How much glory to give.
     */
    constructor (player, taskType, progress, completionThreshold, rewardItemTypes, rewardGlory) {
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
        if(this.progress >= this.completionThreshold){
            this.completed = true;
        }
        // Add this task to the player's task list.
        player.tasks.list[taskType.taskID] = this;

        const rewardItemTypeNumbers = [];
        for(let i=0; i<rewardItemTypes.length; i+=1){
            rewardItemTypeNumbers.push(rewardItemTypes[i].prototype.typeNumber);
        }

        // Tell the client to add the task.
        player.socket.sendEvent(player.EventsList.task_added, {
            taskID: taskType.taskID,
            progress: this.progress,
            completionThreshold: this.completionThreshold,
            rewardItemTypeNumbers: rewardItemTypeNumbers,
            rewardGlory: this.rewardGlory
        });

    }

    progressMade () {
        if(this.completed === true) return;
        this.progress += 1;
        // Tell the player they have made progress on the task.
        // The client can work out whether it has been completed.
        this.player.socket.sendEvent(EventsList.task_progress_made, {taskID: this.taskType.taskID, progress: this.progress});
        if(this.progress >= this.completionThreshold){
            this.completed = true;
        }
    }

    claimReward () {
        if(this.completed === false) return;

        // Remove this task from the player's task list.
        delete this.player.tasks.list[this.taskType.taskID];

        // Give them the rewards.
        this.player.modGlory(this.rewardGlory);

        const rewardItemTypes = this.rewardItemTypes;
        for(let i=0; i<rewardItemTypes.length; i+=1){
            // If they have enough inventory space to claim this reward, add to the inventory.
            if(this.player.isInventoryFull() === false){
                this.player.addToInventory(new rewardItemTypes[i]({}));
            }
            // Otherwise add it to the ground.
            else {
                new rewardItemTypes[i].prototype.PickupType({row: this.player.row, col: this.player.col, board: this.player.board}).emitToNearbyPlayers();
            }
        }
        // Tell the client to remove this task from the list.
        this.player.socket.sendEvent(EventsList.task_claimed, this.taskType.taskID);

        // This task has been removed, add a new one of the same type.
        new NewTask(this.player, this.taskType.category);
    }
}

class NewTask extends Task {
    /**
     *
     * @param {Player} player
     * @param {Array} category
     */
    constructor (player, category) {
        // Get a random task from the list of tasks of the given category.
        const randomTaskType = Utils.getRandomElement(category);

        let taskTypeToUse = randomTaskType;
        // If the player already has this task, use a different one.
        if(player.tasks.list[randomTaskType] !== undefined){
            taskTypeToUse = player.tasks.list[randomTaskType].getOtherTask();
        }

        // The difficulty of the task, or how much stuff to do for it, and how many rewards are given.
        const length = Utils.getRandomIntInclusive(1, 3);

        const rewardItems = [];
        for(let i=0; i<length; i+=1){
            rewardItems.push(Utils.getRandomElement(RewardsList));
        }

        super(
            player,
            taskTypeToUse,
            0,
            5 * length,
            rewardItems,
            500 * length
        );

    }
}

module.exports = {
    Task: Task,
    NewTask: NewTask
};