const CraftingManager = require("../CraftingManager");
const EntitiesList = require("../../EntitiesList");
const ItemsListByName = require("../../ItemsList").BY_NAME;
const { StatNames } = require("../../stats/Statset").prototype;
const TaskTypes = require("../../tasks/TaskTypes");

CraftingManager.addRecipe({ // Iron bar
    result: ItemsListByName.IronBar,
    craftingStat: StatNames.Toolery,
    stationType: EntitiesList.Furnace,
    comp1: ItemsListByName.IronOre,
});

CraftingManager.addRecipe({ // Iron bar (recycle rod)
    result: ItemsListByName.IronBar,
    craftingStat: StatNames.Toolery,
    stationType: EntitiesList.Furnace,
    comp1: ItemsListByName.IronRod,
    statXPGiven: 0,
});

CraftingManager.addRecipe({ // Iron bar (recycle sheet)
    result: ItemsListByName.IronBar,
    craftingStat: StatNames.Toolery,
    stationType: EntitiesList.Furnace,
    comp1: ItemsListByName.IronSheet,
    statXPGiven: 0,
});

CraftingManager.addRecipe({ // Iron rod
    result: ItemsListByName.IronRod,
    craftingStat: StatNames.Toolery,
    stationType: EntitiesList.Anvil,
    comp1: ItemsListByName.IronBar,
    statXPGiven: 0,
});

CraftingManager.addRecipe({ // Iron sheet
    result: ItemsListByName.IronSheet,
    craftingStat: StatNames.Toolery,
    stationType: EntitiesList.Anvil,
    comp1: ItemsListByName.IronRod,
    statXPGiven: 0,
});

CraftingManager.addRecipe({ // Iron arrows
    result: ItemsListByName.IronArrows,
    craftingStat: StatNames.Weaponry,
    stationType: EntitiesList.Workbench,
    comp1: ItemsListByName.IronRod,
    comp2: ItemsListByName.OakLogs,
    comp3: ItemsListByName.OakLogs,
    comp4: ItemsListByName.Feathers,
    taskCrafted: TaskTypes.CraftIronArrows,
});

CraftingManager.addRecipe({ // Iron pickaxe
    result: ItemsListByName.IronPickaxe,
    craftingStat: StatNames.Toolery,
    stationType: EntitiesList.Anvil,
    comp1: ItemsListByName.OakLogs,
    comp2: ItemsListByName.OakLogs,
    comp3: ItemsListByName.IronRod,
    taskCrafted: TaskTypes.CraftIronPickaxes,
});

CraftingManager.addRecipe({ // Iron hatchet
    result: ItemsListByName.IronHatchet,
    craftingStat: StatNames.Toolery,
    stationType: EntitiesList.Anvil,
    comp1: ItemsListByName.OakLogs,
    comp2: ItemsListByName.OakLogs,
    comp3: ItemsListByName.IronSheet,
    taskCrafted: TaskTypes.CraftIronHatchets,
});

CraftingManager.addRecipe({ // Iron dagger
    result: ItemsListByName.IronDagger,
    craftingStat: StatNames.Weaponry,
    stationType: EntitiesList.Anvil,
    comp1: ItemsListByName.IronBar,
    comp2: ItemsListByName.IronBar,
    taskCrafted: TaskTypes.CraftIronDaggers,
});

CraftingManager.addRecipe({ // Iron sword
    result: ItemsListByName.IronSword,
    craftingStat: StatNames.Weaponry,
    stationType: EntitiesList.Anvil,
    comp1: ItemsListByName.IronBar,
    comp2: ItemsListByName.IronBar,
    comp3: ItemsListByName.IronBar,
    taskCrafted: TaskTypes.CraftIronSwords,
});

CraftingManager.addRecipe({ // Iron hammer
    result: ItemsListByName.IronHammer,
    craftingStat: StatNames.Weaponry,
    stationType: EntitiesList.Anvil,
    comp1: ItemsListByName.OakLogs,
    comp2: ItemsListByName.OakLogs,
    comp3: ItemsListByName.IronBar,
    comp4: ItemsListByName.IronBar,
    taskCrafted: TaskTypes.CraftIronHammers,
});

CraftingManager.addRecipe({ // Iron armour
    result: ItemsListByName.IronArmour,
    craftingStat: StatNames.Armoury,
    stationType: EntitiesList.Anvil,
    comp1: ItemsListByName.IronSheet,
    comp2: ItemsListByName.IronSheet,
    comp3: ItemsListByName.IronSheet,
    comp4: ItemsListByName.IronSheet,
    comp5: ItemsListByName.IronSheet,
    taskCrafted: TaskTypes.CraftIronArmour,
});
