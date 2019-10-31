
const CraftingManager = require('./../CraftingManager');
const EntitiesList = require('../../entities/EntitiesList');
const ItemsList = require('./../ItemsList');
const StatNames = require('../../stats/Statset').prototype.StatNames;
const TaskTypes = require('../../tasks/TaskTypes');

CraftingManager.addRecipe({ // Shuriken
    result:         ItemsList.ItemShuriken,
    craftingStat:   StatNames.Toolery,
    stationType:    EntitiesList.Anvil,
    comp1:          ItemsList.ItemIronSheet,
    comp2:          ItemsList.ItemIronSheet,
    taskCrafted:    TaskTypes.CraftShurikens
});

CraftingManager.addRecipe({ // Oak bow
    result:         ItemsList.ItemOakBow,
    craftingStat:   StatNames.Weaponry,
    stationType:    EntitiesList.Workbench,
    comp1:          ItemsList.ItemOakLogs,
    comp2:          ItemsList.ItemOakLogs,
    comp3:          ItemsList.ItemOakLogs,
    comp4:          ItemsList.ItemString,
    taskCrafted:    TaskTypes.CraftOakBows
});

CraftingManager.addRecipe({ // Cloak
    result:         ItemsList.ItemCloak,
    craftingStat:   StatNames.Armoury,
    stationType:    EntitiesList.Workbench,
    comp1:          ItemsList.ItemFabric,
    comp2:          ItemsList.ItemFabric,
    comp3:          ItemsList.ItemGreencap,
    taskCrafted:    TaskTypes.CraftCloaks
});

CraftingManager.addRecipe({ // Ninja garb
    result:         ItemsList.ItemNinjaGarb,
    craftingStat:   StatNames.Armoury,
    stationType:    EntitiesList.Workbench,
    comp1:          ItemsList.ItemFabric,
    comp2:          ItemsList.ItemFabric,
    comp3:          ItemsList.ItemNoctisOre,
    taskCrafted:    TaskTypes.CraftNinjaGarbs
});
