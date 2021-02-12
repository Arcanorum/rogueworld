const CraftingManager = require("../CraftingManager");
const EntitiesList = require("../../EntitiesList");
const ItemsList = require("../../ItemsList");
const { StatNames } = require("../../stats/Statset").prototype;
const TaskTypes = require("../../tasks/TaskTypes");

CraftingManager.addRecipe({ // Health potion
    result: ItemsList.HealthPotion,
    craftingStat: StatNames.Potionry,
    stationType: EntitiesList.Laboratory,
    comp1: ItemsList.Redcap,
    comp2: ItemsList.Redcap,
    taskCrafted: TaskTypes.CraftHealthPotions,
});

CraftingManager.addRecipe({ // Energy potion
    result: ItemsList.EnergyPotion,
    craftingStat: StatNames.Potionry,
    stationType: EntitiesList.Laboratory,
    comp1: ItemsList.Bluecap,
    comp2: ItemsList.Bluecap,
    taskCrafted: TaskTypes.CraftEnergyPotions,
});

CraftingManager.addRecipe({ // Cure potion
    result: ItemsList.CurePotion,
    craftingStat: StatNames.Potionry,
    stationType: EntitiesList.Laboratory,
    comp1: ItemsList.Redcap,
    comp2: ItemsList.Redcap,
    comp3: ItemsList.Greencap,
    taskCrafted: TaskTypes.CraftCurePotions,
});
