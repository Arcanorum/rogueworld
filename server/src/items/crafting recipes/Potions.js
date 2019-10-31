
const CraftingManager = require('./../CraftingManager');
const EntitiesList = require('../../entities/EntitiesList');
const ItemsList = require('./../ItemsList');
const StatNames = require('../../stats/Statset').prototype.StatNames;
const TaskTypes = require('../../tasks/TaskTypes');

CraftingManager.addRecipe({ // Health potion
    result:         ItemsList.ItemHealthPotion,
    craftingStat:   StatNames.Potionry,
    stationType:    EntitiesList.Laboratory,
    comp1:          ItemsList.ItemRedcap,
    comp2:          ItemsList.ItemRedcap,
    taskCrafted:    TaskTypes.CraftHealthPotions
});

CraftingManager.addRecipe({ // Energy potion
    result:         ItemsList.ItemEnergyPotion,
    craftingStat:   StatNames.Potionry,
    stationType:    EntitiesList.Laboratory,
    comp1:          ItemsList.ItemBluecap,
    comp2:          ItemsList.ItemBluecap,
    taskCrafted:    TaskTypes.CraftEnergyPotions
});

CraftingManager.addRecipe({ // Cure potion
    result:         ItemsList.ItemCurePotion,
    craftingStat:   StatNames.Potionry,
    stationType:    EntitiesList.Laboratory,
    comp1:          ItemsList.ItemRedcap,
    comp2:          ItemsList.ItemRedcap,
    comp3:          ItemsList.ItemGreencap,
    taskCrafted:    TaskTypes.CraftCurePotions
});