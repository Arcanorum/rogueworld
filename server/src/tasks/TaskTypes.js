const Utils = require("../Utils");
const TaskCategories = require("./TaskCategories");

const TaskTypes = {};

class TaskType {
    /**
     *
     * @param {String} taskId
     * @param {Array} category
     */
    constructor(taskId, category) {
        if (TaskTypes[taskId] !== undefined) {
            Utils.error(`Cannot create new task type, task name already exists in task types list: ${taskId}`);
        }
        this.taskId = taskId;
        this.otherTasks = [];
        this.category = category;
        category.push(this);
    }

    getOtherTask() {
        return Utils.getRandomElement(this.otherTasks);
    }
}

TaskTypes.KillRats = new TaskType("KillRats", TaskCategories.Kill);
TaskTypes.KillBats = new TaskType("KillBats", TaskCategories.Kill);
TaskTypes.KillHawks = new TaskType("KillHawks", TaskCategories.Kill);
TaskTypes.KillGoblins = new TaskType("KillGoblins", TaskCategories.Kill);
// TaskTypes.KillSnoovirs =        new TaskType("KillSnoovirs",        TaskCategories.Kill);
TaskTypes.KillScamps = new TaskType("KillScamps", TaskCategories.Kill);
TaskTypes.KillZombies = new TaskType("KillZombies", TaskCategories.Kill);
TaskTypes.KillVampires = new TaskType("KillVampires", TaskCategories.Kill);
TaskTypes.KillOutlaws = new TaskType("KillOutlaws", TaskCategories.Kill);
TaskTypes.KillWarriors = new TaskType("KillWarriors", TaskCategories.Kill);
TaskTypes.KillGnarls = new TaskType("KillGnarls", TaskCategories.Kill);
TaskTypes.KillAdumbrals = new TaskType("KillAdumbrals", TaskCategories.Kill);

TaskTypes.GatherCotton = new TaskType("GatherCotton", TaskCategories.Gather);
TaskTypes.GatherRedcaps = new TaskType("GatherRedcaps", TaskCategories.Gather);
TaskTypes.GatherGreencaps = new TaskType("GatherGreencaps", TaskCategories.Gather);
TaskTypes.GatherBluecaps = new TaskType("GatherBluecaps", TaskCategories.Gather);
TaskTypes.GatherPineLogs = new TaskType("GatherPineLogs", TaskCategories.Gather);
TaskTypes.GatherWillowLogs = new TaskType("GatherWillowLogs", TaskCategories.Gather);
TaskTypes.GatherOakLogs = new TaskType("GatherOakLogs", TaskCategories.Gather);
TaskTypes.GatherIronOre = new TaskType("GatherIronOre", TaskCategories.Gather);
TaskTypes.GatherDungiumOre = new TaskType("GatherDungiumOre", TaskCategories.Gather);
TaskTypes.GatherNoctisOre = new TaskType("GatherNoctisOre", TaskCategories.Gather);

TaskTypes.CraftArrows = new TaskType("CraftArrows", TaskCategories.Craft);
TaskTypes.CraftDaggers = new TaskType("CraftDaggers", TaskCategories.Craft);
TaskTypes.CraftSwords = new TaskType("CraftSwords", TaskCategories.Craft);
TaskTypes.CraftHammers = new TaskType("CraftHammers", TaskCategories.Craft);
TaskTypes.CraftShurikens = new TaskType("CraftShurikens", TaskCategories.Craft);
TaskTypes.CraftBows = new TaskType("CraftBows", TaskCategories.Craft);
TaskTypes.CraftStaffs = new TaskType("CraftStaffs", TaskCategories.Craft);
TaskTypes.CraftHatchets = new TaskType("CraftHatchets", TaskCategories.Craft);
TaskTypes.CraftPickaxes = new TaskType("CraftPickaxes", TaskCategories.Craft);
TaskTypes.CraftMetalArmour = new TaskType("CraftMetalArmour", TaskCategories.Craft);
TaskTypes.CraftCloaks = new TaskType("CraftCloaks", TaskCategories.Craft);
TaskTypes.CraftRobes = new TaskType("CraftRobes", TaskCategories.Craft);
TaskTypes.CraftIronGear = new TaskType("CraftIronGear", TaskCategories.Craft);
TaskTypes.CraftDungiumGear = new TaskType("CraftDungiumGear", TaskCategories.Craft);
TaskTypes.CraftNoctisGear = new TaskType("CraftNoctisGear", TaskCategories.Craft);
TaskTypes.CraftFabricGear = new TaskType("CraftFabricGear", TaskCategories.Craft);
TaskTypes.CraftPotions = new TaskType("CraftPotions", TaskCategories.Craft);

// Precompute the list of other task types in the same category for every task type.

Object.values(TaskCategories).forEach((category) => {
    Object.values(category).forEach((taskType) => {
        Object.values(category).forEach((taskTypeToAdd) => {
            if (taskTypeToAdd === taskType) return;
            taskType.otherTasks.push(taskTypeToAdd);
        });
    });
});

module.exports = TaskTypes;
