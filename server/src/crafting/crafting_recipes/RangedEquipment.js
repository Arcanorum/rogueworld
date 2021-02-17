const CraftingManager = require("../CraftingManager");
const EntitiesList = require("../../EntitiesList");
const ItemsListByName = require("../../ItemsList").BY_NAME;
const { StatNames } = require("../../stats/Statset").prototype;
const TaskTypes = require("../../tasks/TaskTypes");

CraftingManager.addRecipe({ // Shuriken
    result: ItemsListByName.Shuriken,
    craftingStat: StatNames.Toolery,
    stationType: EntitiesList.Anvil,
    comp1: ItemsListByName.IronSheet,
    comp2: ItemsListByName.IronSheet,
    taskCrafted: TaskTypes.CraftShurikens,
});

CraftingManager.addRecipe({ // Oak bow
    result: ItemsListByName.OakBow,
    craftingStat: StatNames.Weaponry,
    stationType: EntitiesList.Workbench,
    comp1: ItemsListByName.OakLogs,
    comp2: ItemsListByName.OakLogs,
    comp3: ItemsListByName.OakLogs,
    comp4: ItemsListByName.String,
    taskCrafted: TaskTypes.CraftOakBows,
});

CraftingManager.addRecipe({ // Cloak
    result: ItemsListByName.Cloak,
    craftingStat: StatNames.Armoury,
    stationType: EntitiesList.Workbench,
    comp1: ItemsListByName.Fabric,
    comp2: ItemsListByName.Fabric,
    comp3: ItemsListByName.Greencap,
    taskCrafted: TaskTypes.CraftCloaks,
});

CraftingManager.addRecipe({ // Ninja garb
    result: ItemsListByName.NinjaGarb,
    craftingStat: StatNames.Armoury,
    stationType: EntitiesList.Workbench,
    comp1: ItemsListByName.Fabric,
    comp2: ItemsListByName.Fabric,
    comp3: ItemsListByName.NoctisOre,
    taskCrafted: TaskTypes.CraftNinjaGarbs,
});
