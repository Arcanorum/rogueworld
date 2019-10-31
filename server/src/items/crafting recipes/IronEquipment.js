
const CraftingManager = require('./../CraftingManager');
const EntitiesList = require('../../entities/EntitiesList');
const ItemsList = require('./../ItemsList');
const StatNames = require('../../stats/Statset').prototype.StatNames;
const TaskTypes = require('../../tasks/TaskTypes');

CraftingManager.addRecipe({ // Iron bar
    result:         ItemsList.ItemIronBar,
    craftingStat:   StatNames.Toolery,
    stationType:    EntitiesList.Furnace,
    comp1:          ItemsList.ItemIronOre
});

CraftingManager.addRecipe({ // Iron bar (recycle rod)
    result:         ItemsList.ItemIronBar,
    craftingStat:   StatNames.Toolery,
    stationType:    EntitiesList.Furnace,
    comp1:          ItemsList.ItemIronRod,
    statXPGiven:    0
});

CraftingManager.addRecipe({ // Iron bar (recycle sheet)
    result:         ItemsList.ItemIronBar,
    craftingStat:   StatNames.Toolery,
    stationType:    EntitiesList.Furnace,
    comp1:          ItemsList.ItemIronSheet,
    statXPGiven:    0
});

CraftingManager.addRecipe({ // Iron rod
    result:         ItemsList.ItemIronRod,
    craftingStat:   StatNames.Toolery,
    stationType:    EntitiesList.Anvil,
    comp1:          ItemsList.ItemIronBar,
    statXPGiven:    0
});

CraftingManager.addRecipe({ // Iron sheet
    result:         ItemsList.ItemIronSheet,
    craftingStat:   StatNames.Toolery,
    stationType:    EntitiesList.Anvil,
    comp1:          ItemsList.ItemIronRod,
    statXPGiven:    0
});

CraftingManager.addRecipe({ // Iron arrows
    result:         ItemsList.ItemIronArrows,
    craftingStat:   StatNames.Weaponry,
    stationType:    EntitiesList.Workbench,
    comp1:          ItemsList.ItemIronRod,
    comp2:          ItemsList.ItemOakLogs,
    comp3:          ItemsList.ItemOakLogs,
    comp4:          ItemsList.ItemFeathers,
    taskCrafted:    TaskTypes.CraftIronArrows
});

CraftingManager.addRecipe({ // Iron pickaxe
    result:         ItemsList.ItemIronPickaxe,
    craftingStat:   StatNames.Toolery,
    stationType:    EntitiesList.Anvil,
    comp1:          ItemsList.ItemOakLogs,
    comp2:          ItemsList.ItemOakLogs,
    comp3:          ItemsList.ItemIronRod,
    taskCrafted:    TaskTypes.CraftIronPickaxes
});

CraftingManager.addRecipe({ // Iron hatchet
    result:         ItemsList.ItemIronHatchet,
    craftingStat:   StatNames.Toolery,
    stationType:    EntitiesList.Anvil,
    comp1:          ItemsList.ItemOakLogs,
    comp2:          ItemsList.ItemOakLogs,
    comp3:          ItemsList.ItemIronSheet,
    taskCrafted:    TaskTypes.CraftIronHatchets
});

CraftingManager.addRecipe({ // Iron dagger
    result:         ItemsList.ItemIronDagger,
    craftingStat:   StatNames.Weaponry,
    stationType:    EntitiesList.Anvil,
    comp1:          ItemsList.ItemIronBar,
    comp2:          ItemsList.ItemIronBar,
    taskCrafted:    TaskTypes.CraftIronDaggers
});

CraftingManager.addRecipe({ // Iron sword
    result:         ItemsList.ItemIronSword,
    craftingStat:   StatNames.Weaponry,
    stationType:    EntitiesList.Anvil,
    comp1:          ItemsList.ItemIronBar,
    comp2:          ItemsList.ItemIronBar,
    comp3:          ItemsList.ItemIronBar,
    taskCrafted:    TaskTypes.CraftIronSwords
});

CraftingManager.addRecipe({ // Iron hammer
    result:         ItemsList.ItemIronHammer,
    craftingStat:   StatNames.Weaponry,
    stationType:    EntitiesList.Anvil,
    comp1:          ItemsList.ItemOakLogs,
    comp2:          ItemsList.ItemOakLogs,
    comp3:          ItemsList.ItemIronBar,
    comp4:          ItemsList.ItemIronBar,
    taskCrafted:    TaskTypes.CraftIronHammers
});

CraftingManager.addRecipe({ // Iron armour
    result:         ItemsList.ItemIronArmour,
    craftingStat:   StatNames.Armoury,
    stationType:    EntitiesList.Anvil,
    comp1:          ItemsList.ItemIronSheet,
    comp2:          ItemsList.ItemIronSheet,
    comp3:          ItemsList.ItemIronSheet,
    comp4:          ItemsList.ItemIronSheet,
    comp5:          ItemsList.ItemIronSheet,
    taskCrafted:    TaskTypes.CraftIronArmour
});