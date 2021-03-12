const CraftingManager = require("../CraftingManager");
const EntitiesList = require("../../EntitiesList");
const ItemsListByName = require("../../ItemsList").BY_NAME;
const { StatNames } = require("../../stats/Statset").prototype;
const TaskTypes = require("../../tasks/TaskTypes");

CraftingManager.addRecipe({ // Noctis bar
    result: ItemsListByName.NoctisBar,
    craftingStat: StatNames.Toolery,
    stationType: EntitiesList.Furnace,
    comp1: ItemsListByName.NoctisOre,
});

CraftingManager.addRecipe({ // Noctis bar (recycle rod)
    result: ItemsListByName.NoctisBar,
    craftingStat: StatNames.Toolery,
    stationType: EntitiesList.Furnace,
    comp1: ItemsListByName.NoctisRod,
    statXPGiven: 0,
});

CraftingManager.addRecipe({ // Noctis bar (recycle sheet)
    result: ItemsListByName.NoctisBar,
    craftingStat: StatNames.Toolery,
    stationType: EntitiesList.Furnace,
    comp1: ItemsListByName.NoctisSheet,
    statXPGiven: 0,
});

CraftingManager.addRecipe({ // Noctis rod
    result: ItemsListByName.NoctisRod,
    craftingStat: StatNames.Toolery,
    stationType: EntitiesList.Anvil,
    comp1: ItemsListByName.NoctisBar,
    statXPGiven: 0,
});

CraftingManager.addRecipe({ // Noctis sheet
    result: ItemsListByName.NoctisSheet,
    craftingStat: StatNames.Toolery,
    stationType: EntitiesList.Anvil,
    comp1: ItemsListByName.NoctisRod,
    statXPGiven: 0,
});

CraftingManager.addRecipe({ // Noctis arrows
    result: ItemsListByName.NoctisArrows,
    craftingStat: StatNames.Weaponry,
    stationType: EntitiesList.Workbench,
    comp1: ItemsListByName.NoctisRod,
    comp2: ItemsListByName.OakLogs,
    comp3: ItemsListByName.OakLogs,
    comp4: ItemsListByName.Feathers,
    taskCrafted: TaskTypes.CraftNoctisArrows,
});

CraftingManager.addRecipe({ // Noctis pickaxe
    result: ItemsListByName.NoctisPickaxe,
    craftingStat: StatNames.Toolery,
    stationType: EntitiesList.Anvil,
    comp1: ItemsListByName.OakLogs,
    comp2: ItemsListByName.OakLogs,
    comp3: ItemsListByName.NoctisRod,
    taskCrafted: TaskTypes.CraftNoctisPickaxes,
});

CraftingManager.addRecipe({ // Noctis hatchet
    result: ItemsListByName.NoctisHatchet,
    craftingStat: StatNames.Toolery,
    stationType: EntitiesList.Anvil,
    comp1: ItemsListByName.OakLogs,
    comp2: ItemsListByName.OakLogs,
    comp3: ItemsListByName.NoctisSheet,
    taskCrafted: TaskTypes.CraftNoctisHatchets,
});

CraftingManager.addRecipe({ // Noctis dagger
    result: ItemsListByName.NoctisDagger,
    craftingStat: StatNames.Weaponry,
    stationType: EntitiesList.Anvil,
    comp1: ItemsListByName.NoctisBar,
    comp2: ItemsListByName.NoctisBar,
    taskCrafted: TaskTypes.CraftNoctisDaggers,
});

CraftingManager.addRecipe({ // Noctis sword
    result: ItemsListByName.NoctisSword,
    craftingStat: StatNames.Weaponry,
    stationType: EntitiesList.Anvil,
    comp1: ItemsListByName.NoctisBar,
    comp2: ItemsListByName.NoctisBar,
    comp3: ItemsListByName.NoctisBar,
    taskCrafted: TaskTypes.CraftNoctisSwords,
});

CraftingManager.addRecipe({ // Noctis hammer
    result: ItemsListByName.NoctisHammer,
    craftingStat: StatNames.Weaponry,
    stationType: EntitiesList.Anvil,
    comp1: ItemsListByName.OakLogs,
    comp2: ItemsListByName.OakLogs,
    comp3: ItemsListByName.NoctisBar,
    comp4: ItemsListByName.NoctisBar,
    taskCrafted: TaskTypes.CraftNoctisHammers,
});

CraftingManager.addRecipe({ // Noctis armour
    result: ItemsListByName.NoctisArmour,
    craftingStat: StatNames.Armoury,
    stationType: EntitiesList.Anvil,
    comp1: ItemsListByName.NoctisSheet,
    comp2: ItemsListByName.NoctisSheet,
    comp3: ItemsListByName.NoctisSheet,
    comp4: ItemsListByName.NoctisSheet,
    comp5: ItemsListByName.NoctisSheet,
    taskCrafted: TaskTypes.CraftNoctisArmour,
});
