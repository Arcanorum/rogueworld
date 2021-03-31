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
        if(this.list[task.taskID] !== undefined){
            console.log("* WARNING: Attempt to add a task progress with a task ID that is already in use:", task.taskType.name);
            return;
        }

        //this.list[task.taskID] = new TaskProgress(this.owner, task, progress);

        // Tell the client to add the task.
        //this.owner.socket.sendEvent(this.owner.EventsList.task_added, {taskID: task.taskID, progress: this.list[task.taskID].progress});
    } */

    /**
     * Increase the progress made in this task.
     * @param {String} taskID
     */
    progressTask(taskID) {
        if (this.list[taskID] === undefined) return;
        this.list[taskID].progressMade();
    }

    // The owner has no task progress so far, give them the starting tasks.
    addStartingTasks() {
        const { owner } = this;
        const { TinyLootBox } = ItemsListByName;
        this.owner.tasks.list = {};
        new Task.Task(owner, TaskTypes.KillRats, 0, 5, [TinyLootBox], 500);
        new Task.Task(owner, TaskTypes.KillBats, 0, 5, [TinyLootBox], 500);
        new Task.Task(owner, TaskTypes.GatherIronOre, 0, 5, [TinyLootBox], 500);
        new Task.Task(owner, TaskTypes.GatherCotton, 0, 5, [TinyLootBox], 500);
        new Task.Task(owner, TaskTypes.CraftIronDaggers, 0, 5, [TinyLootBox], 500);
        new Task.Task(owner, TaskTypes.CraftPlainRobes, 0, 5, [TinyLootBox], 500);
    }

    getEmittableTasks() {
        const emittableTasks = {};

        Object.entries(this.list).forEach(([taskID, task]) => {
            const rewardItemTypeCodes = [];

            task.rewardItemTypes.forEach((ItemType, i) => {
                if (!ItemType) return;
                rewardItemTypeCodes[i] = task.rewardItemTypes[i].prototype.typeCode;
            });

            emittableTasks[taskID] = {
                taskID: task.taskType.taskID,
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
