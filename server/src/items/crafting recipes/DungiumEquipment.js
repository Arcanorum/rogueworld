
const CraftingManager = require('./../CraftingManager');
const EntitiesList = require('../../entities/EntitiesList');
const ItemsList = require('./../ItemsList');
const StatNames = require('../../stats/Statset').prototype.StatNames;
const TaskTypes = require('../../tasks/TaskTypes');

CraftingManager.addRecipe({ // Dungium bar
    result:         ItemsList.ItemDungiumBar,
    craftingStat:   StatNames.Toolery,
    stationType:    EntitiesList.Furnace,
    comp1:          ItemsList.ItemDungiumOre
});

CraftingManager.addRecipe({ // Dungium bar (recycle rod)
    result:         ItemsList.ItemDungiumBar,
    craftingStat:   StatNames.Toolery,
    stationType:    EntitiesList.Furnace,
    comp1:          ItemsList.ItemDungiumRod,
    statXPGiven:    0
});

CraftingManager.addRecipe({ // Dungium bar (recycle sheet)
    result:         ItemsList.ItemDungiumBar,
    craftingStat:   StatNames.Toolery,
    stationType:    EntitiesList.Furnace,
    comp1:          ItemsList.ItemDungiumSheet,
    statXPGiven:    0
});

CraftingManager.addRecipe({ // Dungium rod
    result:         ItemsList.ItemDungiumRod,
    craftingStat:   StatNames.Toolery,
    stationType:    EntitiesList.Anvil,
    comp1:          ItemsList.ItemDungiumBar,
    statXPGiven:    0
});

CraftingManager.addRecipe({ // Dungium sheet
    result:         ItemsList.ItemDungiumSheet,
    craftingStat:   StatNames.Toolery,
    stationType:    EntitiesList.Anvil,
    comp1:          ItemsList.ItemDungiumRod,
    statXPGiven:    0
});

CraftingManager.addRecipe({ // Dungium arrows
    result:         ItemsList.ItemDungiumArrows,
    craftingStat:   StatNames.Weaponry,
    stationType:    EntitiesList.Workbench,
    comp1:          ItemsList.ItemDungiumRod,
    comp2:          ItemsList.ItemOakLogs,
    comp3:          ItemsList.ItemOakLogs,
    comp4:          ItemsList.ItemFeathers,
    taskCrafted:    TaskTypes.CraftDungiumArrows
});

CraftingManager.addRecipe({ // Dungium pickaxe
    result:         ItemsList.ItemDungiumPickaxe,
    craftingStat:   StatNames.Toolery,
    stationType:    EntitiesList.Anvil,
    comp1:          ItemsList.ItemOakLogs,
    comp2:          ItemsList.ItemOakLogs,
    comp3:          ItemsList.ItemDungiumRod,
    taskCrafted:    TaskTypes.CraftDungiumPickaxes
});

CraftingManager.addRecipe({ // Dungium hatchet
    result:         ItemsList.ItemDungiumHatchet,
    craftingStat:   StatNames.Toolery,
    stationType:    EntitiesList.Anvil,
    comp1:          ItemsList.ItemOakLogs,
    comp2:          ItemsList.ItemOakLogs,
    comp3:          ItemsList.ItemDungiumSheet,
    taskCrafted:    TaskTypes.CraftDungiumHatchets
});

CraftingManager.addRecipe({ // Dungium dagger
    result:         ItemsList.ItemDungiumDagger,
    craftingStat:   StatNames.Weaponry,
    stationType:    EntitiesList.Anvil,
    comp1:          ItemsList.ItemDungiumBar,
    comp2:          ItemsList.ItemDungiumBar,
    taskCrafted:    TaskTypes.CraftDungiumDaggers
});

CraftingManager.addRecipe({ // Dungium sword
    result:         ItemsList.ItemDungiumSword,
    craftingStat:   StatNames.Weaponry,
    stationType:    EntitiesList.Anvil,
    comp1:          ItemsList.ItemDungiumBar,
    comp2:          ItemsList.ItemDungiumBar,
    comp3:          ItemsList.ItemDungiumBar,
    taskCrafted:    TaskTypes.CraftDungiumSwords
});

CraftingManager.addRecipe({ // Dungium hammer
    result:         ItemsList.ItemDungiumHammer,
    craftingStat:   StatNames.Weaponry,
    stationType:    EntitiesList.Anvil,
    comp1:          ItemsList.ItemOakLogs,
    comp2:          ItemsList.ItemOakLogs,
    comp3:          ItemsList.ItemDungiumBar,
    comp4:          ItemsList.ItemDungiumBar,
    taskCrafted:    TaskTypes.CraftDungiumHammers
});

CraftingManager.addRecipe({ // Dungium armour
    result:         ItemsList.ItemDungiumArmour,
    craftingStat:   StatNames.Armoury,
    stationType:    EntitiesList.Anvil,
    comp1:          ItemsList.ItemDungiumSheet,
    comp2:          ItemsList.ItemDungiumSheet,
    comp3:          ItemsList.ItemDungiumSheet,
    comp4:          ItemsList.ItemDungiumSheet,
    comp5:          ItemsList.ItemDungiumSheet,
    taskCrafted:    TaskTypes.CraftDungiumArmour
});