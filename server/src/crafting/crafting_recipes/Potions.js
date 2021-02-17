const CraftingManager = require("../CraftingManager");
const EntitiesList = require("../../EntitiesList");
const ItemsListByName = require("../../ItemsList").BY_NAME;
const { StatNames } = require("../../stats/Statset").prototype;
const TaskTypes = require("../../tasks/TaskTypes");

CraftingManager.addRecipe({ // Health potion
    result: ItemsListByName.HealthPotion,
    craftingStat: StatNames.Potionry,
    stationType: EntitiesList.Laboratory,
    comp1: ItemsListByName.Redcap,
    comp2: ItemsListByName.Redcap,
    taskCrafted: TaskTypes.CraftHealthPotions,
});

CraftingManager.addRecipe({ // Energy potion
    result: ItemsListByName.EnergyPotion,
    craftingStat: StatNames.Potionry,
    stationType: EntitiesList.Laboratory,
    comp1: ItemsListByName.Bluecap,
    comp2: ItemsListByName.Bluecap,
    taskCrafted: TaskTypes.CraftEnergyPotions,
});

CraftingManager.addRecipe({ // Cure potion
    result: ItemsListByName.CurePotion,
    craftingStat: StatNames.Potionry,
    stationType: EntitiesList.Laboratory,
    comp1: ItemsListByName.Redcap,
    comp2: ItemsListByName.Redcap,
    comp3: ItemsListByName.Greencap,
    taskCrafted: TaskTypes.CraftCurePotions,
});
