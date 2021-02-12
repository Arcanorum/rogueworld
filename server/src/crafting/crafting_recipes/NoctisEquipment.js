const CraftingManager = require("../CraftingManager");
const EntitiesList = require("../../EntitiesList");
const ItemsList = require("../../ItemsList");
const { StatNames } = require("../../stats/Statset").prototype;
const TaskTypes = require("../../tasks/TaskTypes");

CraftingManager.addRecipe({ // Noctis bar
    result: ItemsList.NoctisBar,
    craftingStat: StatNames.Toolery,
    stationType: EntitiesList.Furnace,
    comp1: ItemsList.NoctisOre,
});

CraftingManager.addRecipe({ // Noctis bar (recycle rod)
    result: ItemsList.NoctisBar,
    craftingStat: StatNames.Toolery,
    stationType: EntitiesList.Furnace,
    comp1: ItemsList.NoctisRod,
    statXPGiven: 0,
});

CraftingManager.addRecipe({ // Noctis bar (recycle sheet)
    result: ItemsList.NoctisBar,
    craftingStat: StatNames.Toolery,
    stationType: EntitiesList.Furnace,
    comp1: ItemsList.NoctisSheet,
    statXPGiven: 0,
});

CraftingManager.addRecipe({ // Noctis rod
    result: ItemsList.NoctisRod,
    craftingStat: StatNames.Toolery,
    stationType: EntitiesList.Anvil,
    comp1: ItemsList.NoctisBar,
    statXPGiven: 0,
});

CraftingManager.addRecipe({ // Noctis sheet
    result: ItemsList.NoctisSheet,
    craftingStat: StatNames.Toolery,
    stationType: EntitiesList.Anvil,
    comp1: ItemsList.NoctisRod,
    statXPGiven: 0,
});

CraftingManager.addRecipe({ // Noctis arrows
    result: ItemsList.NoctisArrows,
    craftingStat: StatNames.Weaponry,
    stationType: EntitiesList.Workbench,
    comp1: ItemsList.NoctisRod,
    comp2: ItemsList.OakLogs,
    comp3: ItemsList.OakLogs,
    comp4: ItemsList.Feathers,
    taskCrafted: TaskTypes.CraftNoctisArrows,
});

CraftingManager.addRecipe({ // Noctis pickaxe
    result: ItemsList.NoctisPickaxe,
    craftingStat: StatNames.Toolery,
    stationType: EntitiesList.Anvil,
    comp1: ItemsList.OakLogs,
    comp2: ItemsList.OakLogs,
    comp3: ItemsList.NoctisRod,
    taskCrafted: TaskTypes.CraftNoctisPickaxes,
});

CraftingManager.addRecipe({ // Noctis hatchet
    result: ItemsList.NoctisHatchet,
    craftingStat: StatNames.Toolery,
    stationType: EntitiesList.Anvil,
    comp1: ItemsList.OakLogs,
    comp2: ItemsList.OakLogs,
    comp3: ItemsList.NoctisSheet,
    taskCrafted: TaskTypes.CraftNoctisHatchets,
});

CraftingManager.addRecipe({ // Noctis dagger
    result: ItemsList.NoctisDagger,
    craftingStat: StatNames.Weaponry,
    stationType: EntitiesList.Anvil,
    comp1: ItemsList.NoctisBar,
    comp2: ItemsList.NoctisBar,
    taskCrafted: TaskTypes.CraftNoctisDaggers,
});

CraftingManager.addRecipe({ // Noctis sword
    result: ItemsList.NoctisSword,
    craftingStat: StatNames.Weaponry,
    stationType: EntitiesList.Anvil,
    comp1: ItemsList.NoctisBar,
    comp2: ItemsList.NoctisBar,
    comp3: ItemsList.NoctisBar,
    taskCrafted: TaskTypes.CraftNoctisSwords,
});

CraftingManager.addRecipe({ // Noctis hammer
    result: ItemsList.NoctisHammer,
    craftingStat: StatNames.Weaponry,
    stationType: EntitiesList.Anvil,
    comp1: ItemsList.OakLogs,
    comp2: ItemsList.OakLogs,
    comp3: ItemsList.NoctisBar,
    comp4: ItemsList.NoctisBar,
    taskCrafted: TaskTypes.CraftNoctisHammers,
});

CraftingManager.addRecipe({ // Noctis armour
    result: ItemsList.NoctisArmour,
    craftingStat: StatNames.Armoury,
    stationType: EntitiesList.Anvil,
    comp1: ItemsList.NoctisSheet,
    comp2: ItemsList.NoctisSheet,
    comp3: ItemsList.NoctisSheet,
    comp4: ItemsList.NoctisSheet,
    comp5: ItemsList.NoctisSheet,
    taskCrafted: TaskTypes.CraftNoctisArmour,
});
