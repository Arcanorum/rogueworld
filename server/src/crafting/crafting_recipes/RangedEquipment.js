const CraftingManager = require("../CraftingManager");
const EntitiesList = require("../../EntitiesList");
const ItemsList = require("../../ItemsList");
const { StatNames } = require("../../stats/Statset").prototype;
const TaskTypes = require("../../tasks/TaskTypes");

CraftingManager.addRecipe({ // Shuriken
    result: ItemsList.Shuriken,
    craftingStat: StatNames.Toolery,
    stationType: EntitiesList.Anvil,
    comp1: ItemsList.IronSheet,
    comp2: ItemsList.IronSheet,
    taskCrafted: TaskTypes.CraftShurikens,
});

CraftingManager.addRecipe({ // Oak bow
    result: ItemsList.OakBow,
    craftingStat: StatNames.Weaponry,
    stationType: EntitiesList.Workbench,
    comp1: ItemsList.OakLogs,
    comp2: ItemsList.OakLogs,
    comp3: ItemsList.OakLogs,
    comp4: ItemsList.String,
    taskCrafted: TaskTypes.CraftOakBows,
});

CraftingManager.addRecipe({ // Cloak
    result: ItemsList.Cloak,
    craftingStat: StatNames.Armoury,
    stationType: EntitiesList.Workbench,
    comp1: ItemsList.Fabric,
    comp2: ItemsList.Fabric,
    comp3: ItemsList.Greencap,
    taskCrafted: TaskTypes.CraftCloaks,
});

CraftingManager.addRecipe({ // Ninja garb
    result: ItemsList.NinjaGarb,
    craftingStat: StatNames.Armoury,
    stationType: EntitiesList.Workbench,
    comp1: ItemsList.Fabric,
    comp2: ItemsList.Fabric,
    comp3: ItemsList.NoctisOre,
    taskCrafted: TaskTypes.CraftNinjaGarbs,
});
