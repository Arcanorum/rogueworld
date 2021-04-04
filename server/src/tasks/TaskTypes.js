const Utils = require("../Utils");

const TaskCategories = {
    Kill: [],
    Gather: [],
    Craft: [],
};

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
TaskTypes.GatherOakLogs = new TaskType("GatherOakLogs", TaskCategories.Gather);
TaskTypes.GatherIronOre = new TaskType("GatherIronOre", TaskCategories.Gather);
TaskTypes.GatherDungiumOre = new TaskType("GatherDungiumOre", TaskCategories.Gather);
TaskTypes.GatherNoctisOre = new TaskType("GatherNoctisOre", TaskCategories.Gather);

TaskTypes.CraftIronArrows = new TaskType("CraftIronArrows", TaskCategories.Craft);
TaskTypes.CraftIronDaggers = new TaskType("CraftIronDaggers", TaskCategories.Craft);
TaskTypes.CraftIronSwords = new TaskType("CraftIronSwords", TaskCategories.Craft);
TaskTypes.CraftIronHammers = new TaskType("CraftIronHammers", TaskCategories.Craft);
TaskTypes.CraftIronArmour = new TaskType("CraftIronArmour", TaskCategories.Craft);
TaskTypes.CraftIronHatchets = new TaskType("CraftIronHatchets", TaskCategories.Craft);
TaskTypes.CraftIronPickaxes = new TaskType("CraftIronPickaxes", TaskCategories.Craft);
TaskTypes.CraftDungiumArrows = new TaskType("CraftDungiumArrows", TaskCategories.Craft);
TaskTypes.CraftDungiumDaggers = new TaskType("CraftDungiumDaggers", TaskCategories.Craft);
TaskTypes.CraftDungiumSwords = new TaskType("CraftDungiumSwords", TaskCategories.Craft);
TaskTypes.CraftDungiumHammers = new TaskType("CraftDungiumHammers", TaskCategories.Craft);
TaskTypes.CraftDungiumArmour = new TaskType("CraftDungiumArmour", TaskCategories.Craft);
TaskTypes.CraftDungiumHatchets = new TaskType("CraftDungiumHatchets", TaskCategories.Craft);
TaskTypes.CraftDungiumPickaxes = new TaskType("CraftDungiumPickaxes", TaskCategories.Craft);
TaskTypes.CraftNoctisArrows = new TaskType("CraftNoctisArrows", TaskCategories.Craft);
TaskTypes.CraftNoctisDaggers = new TaskType("CraftNoctisDaggers", TaskCategories.Craft);
TaskTypes.CraftNoctisSwords = new TaskType("CraftNoctisSwords", TaskCategories.Craft);
TaskTypes.CraftNoctisHammers = new TaskType("CraftNoctisHammers", TaskCategories.Craft);
TaskTypes.CraftNoctisArmour = new TaskType("CraftNoctisArmour", TaskCategories.Craft);
TaskTypes.CraftNoctisHatchets = new TaskType("CraftNoctisHatchets", TaskCategories.Craft);
TaskTypes.CraftNoctisPickaxes = new TaskType("CraftNoctisPickaxes", TaskCategories.Craft);
TaskTypes.CraftWindStaffs = new TaskType("CraftWindStaffs", TaskCategories.Craft);
TaskTypes.CraftFireStaffs = new TaskType("CraftFireStaffs", TaskCategories.Craft);
TaskTypes.CraftBloodStaffs = new TaskType("CraftBloodStaffs", TaskCategories.Craft);
TaskTypes.CraftHealthPotions = new TaskType("CraftHealthPotions", TaskCategories.Craft);
TaskTypes.CraftEnergyPotions = new TaskType("CraftEnergyPotions", TaskCategories.Craft);
TaskTypes.CraftCurePotions = new TaskType("CraftCurePotions", TaskCategories.Craft);
TaskTypes.CraftOakBows = new TaskType("CraftOakBows", TaskCategories.Craft);
TaskTypes.CraftShurikens = new TaskType("CraftShurikens", TaskCategories.Craft);
TaskTypes.CraftCloaks = new TaskType("CraftCloaks", TaskCategories.Craft);
TaskTypes.CraftNinjaGarbs = new TaskType("CraftNinjaGarbs", TaskCategories.Craft);
TaskTypes.CraftPlainRobes = new TaskType("CraftPlainRobes", TaskCategories.Craft);
TaskTypes.CraftMageRobes = new TaskType("CraftMageRobes", TaskCategories.Craft);
TaskTypes.CraftNecromancerRobes = new TaskType("CraftNecromancerRobes", TaskCategories.Craft);

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
