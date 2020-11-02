const CraftingManager = require("./../CraftingManager");
const EntitiesList = require("../../EntitiesList");
const ItemsList = require("../../ItemsList");
const StatNames = require("../../stats/Statset").prototype.StatNames;
const TaskTypes = require("../../tasks/TaskTypes");

CraftingManager.addRecipe({ // Iron bar
    result:         ItemsList.IronBar,
    craftingStat:   StatNames.Toolery,
    stationType:    EntitiesList.Furnace,
    comp1:          ItemsList.IronOre
});

CraftingManager.addRecipe({ // Iron bar (recycle rod)
    result:         ItemsList.IronBar,
    craftingStat:   StatNames.Toolery,
    stationType:    EntitiesList.Furnace,
    comp1:          ItemsList.IronRod,
    statXPGiven:    0
});

CraftingManager.addRecipe({ // Iron bar (recycle sheet)
    result:         ItemsList.IronBar,
    craftingStat:   StatNames.Toolery,
    stationType:    EntitiesList.Furnace,
    comp1:          ItemsList.IronSheet,
    statXPGiven:    0
});

CraftingManager.addRecipe({ // Iron rod
    result:         ItemsList.IronRod,
    craftingStat:   StatNames.Toolery,
    stationType:    EntitiesList.Anvil,
    comp1:          ItemsList.IronBar,
    statXPGiven:    0
});

CraftingManager.addRecipe({ // Iron sheet
    result:         ItemsList.IronSheet,
    craftingStat:   StatNames.Toolery,
    stationType:    EntitiesList.Anvil,
    comp1:          ItemsList.IronRod,
    statXPGiven:    0
});

CraftingManager.addRecipe({ // Iron arrows
    result:         ItemsList.IronArrows,
    craftingStat:   StatNames.Weaponry,
    stationType:    EntitiesList.Workbench,
    comp1:          ItemsList.IronRod,
    comp2:          ItemsList.OakLogs,
    comp3:          ItemsList.OakLogs,
    comp4:          ItemsList.Feathers,
    taskCrafted:    TaskTypes.CraftIronArrows
});

CraftingManager.addRecipe({ // Iron pickaxe
    result:         ItemsList.IronPickaxe,
    craftingStat:   StatNames.Toolery,
    stationType:    EntitiesList.Anvil,
    comp1:          ItemsList.OakLogs,
    comp2:          ItemsList.OakLogs,
    comp3:          ItemsList.IronRod,
    taskCrafted:    TaskTypes.CraftIronPickaxes
});

CraftingManager.addRecipe({ // Iron hatchet
    result:         ItemsList.IronHatchet,
    craftingStat:   StatNames.Toolery,
    stationType:    EntitiesList.Anvil,
    comp1:          ItemsList.OakLogs,
    comp2:          ItemsList.OakLogs,
    comp3:          ItemsList.IronSheet,
    taskCrafted:    TaskTypes.CraftIronHatchets
});

CraftingManager.addRecipe({ // Iron dagger
    result:         ItemsList.IronDagger,
    craftingStat:   StatNames.Weaponry,
    stationType:    EntitiesList.Anvil,
    comp1:          ItemsList.IronBar,
    comp2:          ItemsList.IronBar,
    taskCrafted:    TaskTypes.CraftIronDaggers
});

CraftingManager.addRecipe({ // Iron sword
    result:         ItemsList.IronSword,
    craftingStat:   StatNames.Weaponry,
    stationType:    EntitiesList.Anvil,
    comp1:          ItemsList.IronBar,
    comp2:          ItemsList.IronBar,
    comp3:          ItemsList.IronBar,
    taskCrafted:    TaskTypes.CraftIronSwords
});

CraftingManager.addRecipe({ // Iron hammer
    result:         ItemsList.IronHammer,
    craftingStat:   StatNames.Weaponry,
    stationType:    EntitiesList.Anvil,
    comp1:          ItemsList.OakLogs,
    comp2:          ItemsList.OakLogs,
    comp3:          ItemsList.IronBar,
    comp4:          ItemsList.IronBar,
    taskCrafted:    TaskTypes.CraftIronHammers
});

CraftingManager.addRecipe({ // Iron armour
    result:         ItemsList.IronArmour,
    craftingStat:   StatNames.Armoury,
    stationType:    EntitiesList.Anvil,
    comp1:          ItemsList.IronSheet,
    comp2:          ItemsList.IronSheet,
    comp3:          ItemsList.IronSheet,
    comp4:          ItemsList.IronSheet,
    comp5:          ItemsList.IronSheet,
    taskCrafted:    TaskTypes.CraftIronArmour
});