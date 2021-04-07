const Utils = require("../Utils");
const Task = require("./Task");
const TaskTypes = require("./TaskTypes");
const TaskCategories = require("./TaskCategories");
const ItemsListByName = require("../items/ItemsList").BY_NAME;
const ItemsList = require("../items/ItemsList");

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
     * Increase the progress made in a task, if the player has it.
     * @param {String} taskId
     */
    progressTask(taskId) {
        if (!this.list[taskId]) return;

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
        new Task.Task({ ...config, taskType: TaskTypes.CraftDaggers });
        new Task.Task({ ...config, taskType: TaskTypes.CraftRobes });
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

    loadData(account) {
        try {
            account.tasks.forEach((taskData, savedTaskKey) => {
                // Check the type of task to add is valid, and that the key of the task data in the map in the account matches the taskId.
                // Might have been removed (or renamed) since this player last logged in.
                if (savedTaskKey !== taskData.taskId || !TaskTypes[taskData.taskId]) {
                    account.tasks.delete(savedTaskKey);
                    return;
                }

                // Check the task has a list of reward item types. Might be malformed data.
                if (!taskData.rewardItemTypeCodes) {
                    account.tasks.delete(savedTaskKey);
                    return;
                }

                const rewardItemTypes = taskData.rewardItemTypeCodes.map((rewardItemTypeCode) => {
                    // Check the item to add still exists.
                    // Might have been removed since this player last logged in.
                    if (!ItemsList.BY_CODE[rewardItemTypeCode]) {
                        // Add something else instead to compensate.
                        return ItemsList.BY_NAME.GloryOrb;
                    }

                    return ItemsList.BY_CODE[rewardItemTypeCode];
                });

                new Task.Task({
                    player: this.owner,
                    taskType: TaskTypes[savedTaskKey],
                    progress: taskData.progress,
                    completionThreshold: taskData.completionThreshold,
                    rewardItemTypes,
                    rewardGlory: taskData.rewardGlory,
                    skipSave: true,
                });
            });

            this.checkTaskListIsValid();
        }
        catch (error) {
            Utils.warning(error);
        }
    }

    checkTaskListIsValid() {
        // If they have the right amount of tasks, skip this.
        if (Object.keys(this.list).length === 6) return;

        // If they don't for whatever reason, give them a new random one from the same task
        // category as the missing ones.
        const { owner: player } = this;

        // Count how many tasks there are of each category.
        const getCategoryCount = (categoryName) => {
            let count = 0;
            for (let i = 0, taskIds = Object.keys(this.list); i < taskIds.length; i += 1) {
                if (taskIds[i].startsWith(categoryName)) count += 1;
            }
            return count;
        };

        ["Kill", "Gather", "Craft"].forEach((categoryName) => {
            let tasksOfCategoryCount = getCategoryCount(categoryName);

            while (tasksOfCategoryCount !== 2) {
                if (tasksOfCategoryCount < 2) {
                    // Not enough tasks. Add one.
                    new Task.NewTask({
                        player,
                        category: TaskCategories[categoryName],
                    });
                }
                else {
                    // Too many tasks. Remove one.

                    // Find a task they have from the given category.
                    const taskId = Object
                        .keys(this.list)
                        .find((eachId) => eachId.startsWith(categoryName));

                    this.list[taskId].remove();
                }

                tasksOfCategoryCount = getCategoryCount(categoryName);
            }
        });

        // Need to do a full resave of their tasks data, or they might still have the ones that
        // weren't able to load still in the account data.
        if (player.socket.account) {
            try {
                player.socket.account.tasks.clear();

                // Add each of the loaded tasks, plus any new ones, back in.
                Object.values(this.list).forEach((task) => {
                    const taskData = {
                        taskId: task.taskType.taskId,
                        progress: task.progress,
                        completionThreshold: task.completionThreshold,
                        rewardGlory: task.rewardGlory,
                        rewardItemTypeCodes: task.rewardItemTypes.map(
                            (rewardItemType) => rewardItemType.prototype.typeCode,
                        ),
                    };
                    player.socket.account.tasks.set(task.taskType.taskId, taskData);
                });
            }
            catch (error) {
                Utils.warning(error);
            }
        }
    }
}

module.exports = Taskset;
