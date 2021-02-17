const CraftingManager = require("../CraftingManager");
const EntitiesList = require("../../EntitiesList");
const ItemsListByName = require("../../ItemsList").BY_NAME;
const { StatNames } = require("../../stats/Statset").prototype;
const TaskTypes = require("../../tasks/TaskTypes");

CraftingManager.addRecipe({ // String
    result: ItemsListByName.String,
    craftingStat: StatNames.Toolery,
    stationType: EntitiesList.Workbench,
    comp1: ItemsListByName.Cotton,
});

CraftingManager.addRecipe({ // Fabric
    result: ItemsListByName.Fabric,
    craftingStat: StatNames.Armoury,
    stationType: EntitiesList.Workbench,
    comp1: ItemsListByName.Cotton,
    comp2: ItemsListByName.Cotton,
});
