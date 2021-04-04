const Utils = require("../Utils");
const Task = require("./Task");
const TaskTypes = require("./TaskTypes");
const ItemsListByName = require("../ItemsList").BY_NAME;

class Taskset {
    /**
     * A new set of tasks. Can be continued from what tasks the player had before.
     * @param {Player} owner
     */
    constructor(owner) {
        this.owner = owner;

        this.list = {};
    }

    /**
     *
     * @param {Task} task
     * @param {Number} [progress] - Optional progress to start this task at.
     */
    /* addTask (task, progress) {
        // Don't add the task if there is already one with that ID.
        if(this.list[task.taskId] !== undefined){
            console.log("* WARNING: Attempt to add a task progress with a task ID that is already in use:", task.taskType.name);
            return;
        }

        //this.list[task.taskId] = new TaskProgress(this.owner, task, progress);

        // Tell the client to add the task.
        //this.owner.socket.sendEvent(this.owner.EventsList.task_added, {taskId: task.taskId, progress: this.list[task.taskId].progress});
    } */

    /**
     * Increase the progress made in this task.
     * @param {String} taskId
     */
    progressTask(taskId) {
        if (this.list[taskId] === undefined) return;
        this.list[taskId].progressMade();
    }

    // The owner has no task progress so far, give them the starting tasks.
    addStartingTasks() {
        const { owner: player } = this;
        const { TinyLootBox } = ItemsListByName;
        player.tasks.list = {};

        // Clear any existing tasks data their account may have.
        if (player.socket.account) {
            try {
                player.socket.account.tasks.clear();
            }
            catch (error) {
                Utils.warning(error);
            }
        }

        const config = {
            player,
            completionThreshold: 5,
            rewardItemTypes: [TinyLootBox],
            rewardGlory: 500,
        };

        new Task.Task({ ...config, taskType: TaskTypes.KillRats });
        new Task.Task({ ...config, taskType: TaskTypes.KillBats });
        new Task.Task({ ...config, taskType: TaskTypes.GatherIronOre });
        new Task.Task({ ...config, taskType: TaskTypes.GatherCotton });
        new Task.Task({ ...config, taskType: TaskTypes.CraftIronDaggers });
        new Task.Task({ ...config, taskType: TaskTypes.CraftPlainRobes });
    }

    getEmittableTasks() {
        const emittableTasks = {};

        Object.entries(this.list).forEach(([taskId, task]) => {
            const rewardItemTypeCodes = [];

            task.rewardItemTypes.forEach((ItemType, i) => {
                if (!ItemType) return;
                rewardItemTypeCodes[i] = task.rewardItemTypes[i].prototype.typeCode;
            });

            emittableTasks[taskId] = {
                taskId: task.taskType.taskId,
                progress: task.progress,
                completionThreshold: task.completionThreshold,
                rewardItemTypeCodes,
                rewardGlory: task.rewardGlory,
            };
        });

        return emittableTasks;
    }
}

module.exports = Taskset;
