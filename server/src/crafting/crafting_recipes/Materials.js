const CraftingManager = require("./../CraftingManager");
const EntitiesList = require("../../EntitiesList");
const ItemsList = require("../../ItemsList");
const StatNames = require("../../stats/Statset").prototype.StatNames;
const TaskTypes = require("../../tasks/TaskTypes");

CraftingManager.addRecipe({ // String
    result:         ItemsList.String,
    craftingStat:   StatNames.Toolery,
    stationType:    EntitiesList.Workbench,
    comp1:          ItemsList.Cotton
});

CraftingManager.addRecipe({ // Fabric
    result:         ItemsList.Fabric,
    craftingStat:   StatNames.Armoury,
    stationType:    EntitiesList.Workbench,
    comp1:          ItemsList.Cotton,
    comp2:          ItemsList.Cotton
});