
const CraftingManager = require('./../CraftingManager');
const EntitiesList = require('../../EntitiesList');
const ItemsList = require('../../ItemsList');
const StatNames = require('../../stats/Statset').prototype.StatNames;
const TaskTypes = require('../../tasks/TaskTypes');

CraftingManager.addRecipe({ // Fire staff
    result:         ItemsList.ItemFireStaff,
    craftingStat:   StatNames.Weaponry,
    stationType:    EntitiesList.Workbench,
    comp1:          ItemsList.ItemOakLogs,
    comp2:          ItemsList.ItemOakLogs,
    comp3:          ItemsList.ItemOakLogs,
    comp4:          ItemsList.ItemFireGem,
    taskCrafted:    TaskTypes.CraftFireStaffs
});

CraftingManager.addRecipe({ // Super fire staff
    result:         ItemsList.ItemSuperFireStaff,
    craftingStat:   StatNames.Weaponry,
    stationType:    EntitiesList.Workbench,
    comp1:          ItemsList.ItemOakLogs,
    comp2:          ItemsList.ItemOakLogs,
    comp3:          ItemsList.ItemOakLogs,
    comp4:          ItemsList.ItemFireGem,
    comp5:          ItemsList.ItemFireGem,
    taskCrafted:    TaskTypes.CraftFireStaffs
});

CraftingManager.addRecipe({ // Wind staff
    result:         ItemsList.ItemWindStaff,
    craftingStat:   StatNames.Weaponry,
    stationType:    EntitiesList.Workbench,
    comp1:          ItemsList.ItemOakLogs,
    comp2:          ItemsList.ItemOakLogs,
    comp3:          ItemsList.ItemOakLogs,
    comp4:          ItemsList.ItemWindGem,
    taskCrafted:    TaskTypes.CraftWindStaffs
});

CraftingManager.addRecipe({ // Super wind staff
    result:         ItemsList.ItemSuperWindStaff,
    craftingStat:   StatNames.Weaponry,
    stationType:    EntitiesList.Workbench,
    comp1:          ItemsList.ItemOakLogs,
    comp2:          ItemsList.ItemOakLogs,
    comp3:          ItemsList.ItemOakLogs,
    comp4:          ItemsList.ItemWindGem,
    comp5:          ItemsList.ItemWindGem,
    taskCrafted:    TaskTypes.CraftWindStaffs
});

CraftingManager.addRecipe({ // Blood staff
    result:         ItemsList.ItemBloodStaff,
    craftingStat:   StatNames.Weaponry,
    stationType:    EntitiesList.Workbench,
    comp1:          ItemsList.ItemOakLogs,
    comp2:          ItemsList.ItemOakLogs,
    comp3:          ItemsList.ItemOakLogs,
    comp4:          ItemsList.ItemBloodGem,
    taskCrafted:    TaskTypes.CraftBloodStaffs
});

CraftingManager.addRecipe({ // Super blood staff
    result:         ItemsList.ItemSuperBloodStaff,
    craftingStat:   StatNames.Weaponry,
    stationType:    EntitiesList.Workbench,
    comp1:          ItemsList.ItemOakLogs,
    comp2:          ItemsList.ItemOakLogs,
    comp3:          ItemsList.ItemOakLogs,
    comp4:          ItemsList.ItemBloodGem,
    comp5:          ItemsList.ItemBloodGem,
    taskCrafted:    TaskTypes.CraftBloodStaffs
});

CraftingManager.addRecipe({ // Plain robe
    result:         ItemsList.ItemPlainRobe,
    craftingStat:   StatNames.Armoury,
    stationType:    EntitiesList.Workbench,
    comp1:          ItemsList.ItemFabric,
    comp2:          ItemsList.ItemFabric,
    taskCrafted:    TaskTypes.CraftPlainRobes
});

CraftingManager.addRecipe({ // Mage robe
    result:         ItemsList.ItemMageRobe,
    craftingStat:   StatNames.Armoury,
    stationType:    EntitiesList.Workbench,
    comp1:          ItemsList.ItemPlainRobe,
    comp3:          ItemsList.ItemBluecap,
    taskCrafted:    TaskTypes.CraftMageRobes
});

CraftingManager.addRecipe({ // Necromancer robe
    result:         ItemsList.ItemNecromancerRobe,
    craftingStat:   StatNames.Armoury,
    stationType:    EntitiesList.Workbench,
    comp1:          ItemsList.ItemPlainRobe,
    comp3:          ItemsList.ItemNoctisOre,
    taskCrafted:    TaskTypes.CraftNecromancerRobes
});