
const ItemsList = require('../ItemsList');
const Utils = require('../Utils');

//class Task {
//    /**
//     *
//     * @param {String} taskID - The unique ID of this task.
//     * @param {String} textDefIDName - The ID name in the text defs file for this task.
//     * @param {Number} completionThreshold - How much progress must be made to complete this task.
//     * @param {Object} reward - An object of the items and glory to give when this task is claimed.
//     * @param {Array} reward.itemTypes - The item type class references to give.
//     * @param {Number} reward.glory - How much glory to give.
//     * @param {Function} claimFunction - A function to run when the reward is claimed, to do extra stuff like adding another task.
//     */
//    constructor (taskID, textDefIDName, completionThreshold, reward, claimFunction) {
//        this.taskID = taskID;
//        this.textDefIDName = textDefIDName;
//        this.completionThreshold = completionThreshold;
//        this.reward = reward;
//        this.onClaimed = claimFunction;
//    }
//}


const TaskCategories = {
    Kill: [],
    Gather: [],
    Craft: []
};

const TaskTypes = {};

class TaskType {
    /**
     *
     * @param {String} taskID
     * @param {Array} category
     */
    constructor (taskID, category) {
        if(TaskTypes[taskID] !== undefined) Utils.error("Cannot create new task type, task name already exists in task types list: " + name);
        this.taskID = taskID;
        this.otherTasks = [];
        this.category = category;
        category.push(this);
    }

    getOtherTask () {
        return Utils.getRandomElement(this.otherTasks);
    }
}

TaskTypes.KillRats =            new TaskType("KillRats",            TaskCategories.Kill);
TaskTypes.KillBats =            new TaskType("KillBats",            TaskCategories.Kill);
TaskTypes.KillHawks =           new TaskType("KillHawks",           TaskCategories.Kill);
TaskTypes.KillGoblins =         new TaskType("KillGoblins",         TaskCategories.Kill);
//TaskTypes.KillSnoovirs =        new TaskType("KillSnoovirs",        TaskCategories.Kill);
TaskTypes.KillScamps =          new TaskType("KillScamps",          TaskCategories.Kill);
TaskTypes.KillZombies =         new TaskType("KillZombies",         TaskCategories.Kill);
TaskTypes.KillVampires =        new TaskType("KillVampires",        TaskCategories.Kill);
TaskTypes.KillOutlaws =         new TaskType("KillOutlaws",         TaskCategories.Kill);
TaskTypes.KillWarriors =        new TaskType("KillWarriors",        TaskCategories.Kill);
TaskTypes.KillGnarls =          new TaskType("KillGnarls",          TaskCategories.Kill);

TaskTypes.GatherCotton =        new TaskType("GatherCotton",        TaskCategories.Gather);
TaskTypes.GatherRedcaps =       new TaskType("GatherRedcaps",       TaskCategories.Gather);
TaskTypes.GatherGreencaps =     new TaskType("GatherGreencaps",     TaskCategories.Gather);
TaskTypes.GatherBluecaps =      new TaskType("GatherBluecaps",      TaskCategories.Gather);
TaskTypes.GatherOakLogs =       new TaskType("GatherOakLogs",       TaskCategories.Gather);
TaskTypes.GatherIronOre =       new TaskType("GatherIronOre",       TaskCategories.Gather);
TaskTypes.GatherDungiumOre =    new TaskType("GatherDungiumOre",    TaskCategories.Gather);
TaskTypes.GatherNoctisOre =     new TaskType("GatherNoctisOre",     TaskCategories.Gather);

TaskTypes.CraftIronArrows =     new TaskType("CraftIronArrows",     TaskCategories.Craft);
TaskTypes.CraftIronDaggers =    new TaskType("CraftIronDaggers",    TaskCategories.Craft);
TaskTypes.CraftIronSwords =     new TaskType("CraftIronSwords",     TaskCategories.Craft);
TaskTypes.CraftIronHammers =    new TaskType("CraftIronHammers",    TaskCategories.Craft);
TaskTypes.CraftIronArmour =     new TaskType("CraftIronArmour",     TaskCategories.Craft);
TaskTypes.CraftIronHatchets =   new TaskType("CraftIronHatchets",   TaskCategories.Craft);
TaskTypes.CraftIronPickaxes =   new TaskType("CraftIronPickaxes",   TaskCategories.Craft);
TaskTypes.CraftDungiumArrows =  new TaskType("CraftDungiumArrows",  TaskCategories.Craft);
TaskTypes.CraftDungiumDaggers = new TaskType("CraftDungiumDaggers", TaskCategories.Craft);
TaskTypes.CraftDungiumSwords =  new TaskType("CraftDungiumSwords",  TaskCategories.Craft);
TaskTypes.CraftDungiumHammers = new TaskType("CraftDungiumHammers", TaskCategories.Craft);
TaskTypes.CraftDungiumArmour =  new TaskType("CraftDungiumArmour",  TaskCategories.Craft);
TaskTypes.CraftDungiumHatchets =new TaskType("CraftDungiumHatchets",TaskCategories.Craft);
TaskTypes.CraftDungiumPickaxes =new TaskType("CraftDungiumPickaxes",TaskCategories.Craft);
TaskTypes.CraftNoctisArrows =   new TaskType("CraftNoctisArrows",   TaskCategories.Craft);
TaskTypes.CraftNoctisDaggers =  new TaskType("CraftNoctisDaggers",  TaskCategories.Craft);
TaskTypes.CraftNoctisSwords =   new TaskType("CraftNoctisSwords",   TaskCategories.Craft);
TaskTypes.CraftNoctisHammers =  new TaskType("CraftNoctisHammers",  TaskCategories.Craft);
TaskTypes.CraftNoctisArmour =   new TaskType("CraftNoctisArmour",   TaskCategories.Craft);
TaskTypes.CraftNoctisHatchets = new TaskType("CraftNoctisHatchets", TaskCategories.Craft);
TaskTypes.CraftNoctisPickaxes = new TaskType("CraftNoctisPickaxes", TaskCategories.Craft);
TaskTypes.CraftWindStaffs =     new TaskType("CraftWindStaffs",     TaskCategories.Craft);
TaskTypes.CraftFireStaffs =     new TaskType("CraftFireStaffs",     TaskCategories.Craft);
TaskTypes.CraftBloodStaffs =    new TaskType("CraftBloodStaffs",    TaskCategories.Craft);
TaskTypes.CraftHealthPotions =  new TaskType("CraftHealthPotions",  TaskCategories.Craft);
TaskTypes.CraftEnergyPotions =  new TaskType("CraftEnergyPotions",  TaskCategories.Craft);
TaskTypes.CraftCurePotions =    new TaskType("CraftCurePotions",    TaskCategories.Craft);
TaskTypes.CraftOakBows =        new TaskType("CraftOakBows",        TaskCategories.Craft);
TaskTypes.CraftShurikens =      new TaskType("CraftShurikens",      TaskCategories.Craft);
TaskTypes.CraftCloaks =         new TaskType("CraftCloaks",         TaskCategories.Craft);
TaskTypes.CraftNinjaGarbs =     new TaskType("CraftNinjaGarbs",     TaskCategories.Craft);
TaskTypes.CraftPlainRobes =     new TaskType("CraftPlainRobes",     TaskCategories.Craft);
TaskTypes.CraftMageRobes =      new TaskType("CraftMageRobes",      TaskCategories.Craft);
TaskTypes.CraftNecromancerRobes =  new TaskType("CraftNecromancerRobes",   TaskCategories.Craft);


// Precompute the list of other task types in the same category for every task type.
for(let categoryKey in TaskCategories){
    if(TaskCategories.hasOwnProperty(categoryKey) === false) continue;
    const category = TaskCategories[categoryKey];
    for(let taskTypeKey in category){
        if(category.hasOwnProperty(taskTypeKey) === false) continue;
        /** @type {TaskType} */
        const taskType = category[taskTypeKey];
        for(let taskTypeToAddKey in category){
            if(category.hasOwnProperty(taskTypeToAddKey) === false) continue;
            const taskTypeToAdd = category[taskTypeToAddKey];
            if(taskTypeToAdd === taskType) continue;
            taskType.otherTasks.push(taskTypeToAdd);
        }
    }
}


// Write the registered task types to the client, so the client knows what rewards and progress threshold to use for each type name.
//const fs = require('fs');
//let dataToWrite = {};
/*
for(let typeKey in TaskTypes){
    // Don't check prototype properties.
    if(TaskTypes.hasOwnProperty(typeKey) === false) continue;

    const task = TaskTypes[typeKey];

    dataToWrite[typeKey] = {};
    dataToWrite[typeKey].textDefIDName = task.textDefIDName;
    dataToWrite[typeKey].completionThreshold = task.completionThreshold;
    dataToWrite[typeKey].rewardGlory = task.reward.glory;// TODO: don't write this here, make it dynamic, will be ok...
    dataToWrite[typeKey].rewardItemTypeNumbers = [];
    for(let i=0; i<task.reward.itemTypes.length; i+=1){
        if(task.reward.itemTypes[i] === undefined) continue;
        dataToWrite[typeKey].rewardItemTypeNumbers[i] = task.reward.itemTypes[i].prototype.typeNumber;
    }
}*/
/*
// Check the type catalogue exists. Catches the case that this is the deployment server
// and thus doesn't have a client directory, and thus no type catalogue.
if(fs.existsSync('../client/src/catalogues/TaskTypes.json')){
    // Turn the data into a string.
    dataToWrite = JSON.stringify(dataToWrite);

    // Write the data to the file in the client files.
    fs.writeFileSync('../client/src/catalogues/TaskTypes.json', dataToWrite);

    console.log("* Task types catalogue written to file.");
}*/

module.exports = TaskTypes;