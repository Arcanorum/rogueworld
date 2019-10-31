
const CraftingManager = require('./../CraftingManager');
const EntitiesList = require('../../entities/EntitiesList');
const ItemsList = require('./../ItemsList');
const StatNames = require('../../stats/Statset').prototype.StatNames;
const TaskTypes = require('../../tasks/TaskTypes');

CraftingManager.addRecipe({ // Noctis bar
    result:         ItemsList.ItemNoctisBar,
    craftingStat:   StatNames.Toolery,
    stationType:    EntitiesList.Furnace,
    comp1:          ItemsList.ItemNoctisOre
});

CraftingManager.addRecipe({ // Noctis bar (recycle rod)
    result:         ItemsList.ItemNoctisBar,
    craftingStat:   StatNames.Toolery,
    stationType:    EntitiesList.Furnace,
    comp1:          ItemsList.ItemNoctisRod,
    statXPGiven:    0
});

CraftingManager.addRecipe({ // Noctis bar (recycle sheet)
    result:         ItemsList.ItemNoctisBar,
    craftingStat:   StatNames.Toolery,
    stationType:    EntitiesList.Furnace,
    comp1:          ItemsList.ItemNoctisSheet,
    statXPGiven:    0
});

CraftingManager.addRecipe({ // Noctis rod
    result:         ItemsList.ItemNoctisRod,
    craftingStat:   StatNames.Toolery,
    stationType:    EntitiesList.Anvil,
    comp1:          ItemsList.ItemNoctisBar,
    statXPGiven:    0
});

CraftingManager.addRecipe({ // Noctis sheet
    result:         ItemsList.ItemNoctisSheet,
    craftingStat:   StatNames.Toolery,
    stationType:    EntitiesList.Anvil,
    comp1:          ItemsList.ItemNoctisRod,
    statXPGiven:    0
});

CraftingManager.addRecipe({ // Noctis arrows
    result:         ItemsList.ItemNoctisArrows,
    craftingStat:   StatNames.Weaponry,
    stationType:    EntitiesList.Workbench,
    comp1:          ItemsList.ItemNoctisRod,
    comp2:          ItemsList.ItemOakLogs,
    comp3:          ItemsList.ItemOakLogs,
    comp4:          ItemsList.ItemFeathers,
    taskCrafted:    TaskTypes.CraftNoctisArrows
});

CraftingManager.addRecipe({ // Noctis pickaxe
    result:         ItemsList.ItemNoctisPickaxe,
    craftingStat:   StatNames.Toolery,
    stationType:    EntitiesList.Anvil,
    comp1:          ItemsList.ItemOakLogs,
    comp2:          ItemsList.ItemOakLogs,
    comp3:          ItemsList.ItemNoctisRod,
    taskCrafted:    TaskTypes.CraftNoctisPickaxes
});

CraftingManager.addRecipe({ // Noctis hatchet
    result:         ItemsList.ItemNoctisHatchet,
    craftingStat:   StatNames.Toolery,
    stationType:    EntitiesList.Anvil,
    comp1:          ItemsList.ItemOakLogs,
    comp2:          ItemsList.ItemOakLogs,
    comp3:          ItemsList.ItemNoctisSheet,
    taskCrafted:    TaskTypes.CraftNoctisHatchets
});

CraftingManager.addRecipe({ // Noctis dagger
    result:         ItemsList.ItemNoctisDagger,
    craftingStat:   StatNames.Weaponry,
    stationType:    EntitiesList.Anvil,
    comp1:          ItemsList.ItemNoctisBar,
    comp2:          ItemsList.ItemNoctisBar,
    taskCrafted:    TaskTypes.CraftNoctisDaggers
});

CraftingManager.addRecipe({ // Noctis sword
    result:         ItemsList.ItemNoctisSword,
    craftingStat:   StatNames.Weaponry,
    stationType:    EntitiesList.Anvil,
    comp1:          ItemsList.ItemNoctisBar,
    comp2:          ItemsList.ItemNoctisBar,
    comp3:          ItemsList.ItemNoctisBar,
    taskCrafted:    TaskTypes.CraftNoctisSwords
});

CraftingManager.addRecipe({ // Noctis hammer
    result:         ItemsList.ItemNoctisHammer,
    craftingStat:   StatNames.Weaponry,
    stationType:    EntitiesList.Anvil,
    comp1:          ItemsList.ItemOakLogs,
    comp2:          ItemsList.ItemOakLogs,
    comp3:          ItemsList.ItemNoctisBar,
    comp4:          ItemsList.ItemNoctisBar,
    taskCrafted:    TaskTypes.CraftNoctisHammers
});

CraftingManager.addRecipe({ // Noctis armour
    result:         ItemsList.ItemNoctisArmour,
    craftingStat:   StatNames.Armoury,
    stationType:    EntitiesList.Anvil,
    comp1:          ItemsList.ItemNoctisSheet,
    comp2:          ItemsList.ItemNoctisSheet,
    comp3:          ItemsList.ItemNoctisSheet,
    comp4:          ItemsList.ItemNoctisSheet,
    comp5:          ItemsList.ItemNoctisSheet,
    taskCrafted:    TaskTypes.CraftNoctisArmour
});