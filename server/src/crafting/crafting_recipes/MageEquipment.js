const CraftingManager = require("../CraftingManager");
const EntitiesList = require("../../EntitiesList");
const ItemsListByName = require("../../ItemsList").BY_NAME;
const { StatNames } = require("../../stats/Statset").prototype;
const TaskTypes = require("../../tasks/TaskTypes");

CraftingManager.addRecipe({ // Fire staff
    result: ItemsListByName.FireStaff,
    craftingStat: StatNames.Weaponry,
    stationType: EntitiesList.Workbench,
    comp1: ItemsListByName.OakLogs,
    comp2: ItemsListByName.OakLogs,
    comp3: ItemsListByName.OakLogs,
    comp4: ItemsListByName.FireGem,
    taskCrafted: TaskTypes.CraftFireStaffs,
});

CraftingManager.addRecipe({ // Super fire staff
    result: ItemsListByName.SuperFireStaff,
    craftingStat: StatNames.Weaponry,
    stationType: EntitiesList.Workbench,
    comp1: ItemsListByName.OakLogs,
    comp2: ItemsListByName.OakLogs,
    comp3: ItemsListByName.OakLogs,
    comp4: ItemsListByName.FireGem,
    comp5: ItemsListByName.FireGem,
    taskCrafted: TaskTypes.CraftFireStaffs,
});

CraftingManager.addRecipe({ // Wind staff
    result: ItemsListByName.WindStaff,
    craftingStat: StatNames.Weaponry,
    stationType: EntitiesList.Workbench,
    comp1: ItemsListByName.OakLogs,
    comp2: ItemsListByName.OakLogs,
    comp3: ItemsListByName.OakLogs,
    comp4: ItemsListByName.WindGem,
    taskCrafted: TaskTypes.CraftWindStaffs,
});

CraftingManager.addRecipe({ // Super wind staff
    result: ItemsListByName.SuperWindStaff,
    craftingStat: StatNames.Weaponry,
    stationType: EntitiesList.Workbench,
    comp1: ItemsListByName.OakLogs,
    comp2: ItemsListByName.OakLogs,
    comp3: ItemsListByName.OakLogs,
    comp4: ItemsListByName.WindGem,
    comp5: ItemsListByName.WindGem,
    taskCrafted: TaskTypes.CraftWindStaffs,
});

CraftingManager.addRecipe({ // Blood staff
    result: ItemsListByName.BloodStaff,
    craftingStat: StatNames.Weaponry,
    stationType: EntitiesList.Workbench,
    comp1: ItemsListByName.OakLogs,
    comp2: ItemsListByName.OakLogs,
    comp3: ItemsListByName.OakLogs,
    comp4: ItemsListByName.BloodGem,
    taskCrafted: TaskTypes.CraftBloodStaffs,
});

CraftingManager.addRecipe({ // Super blood staff
    result: ItemsListByName.SuperBloodStaff,
    craftingStat: StatNames.Weaponry,
    stationType: EntitiesList.Workbench,
    comp1: ItemsListByName.OakLogs,
    comp2: ItemsListByName.OakLogs,
    comp3: ItemsListByName.OakLogs,
    comp4: ItemsListByName.BloodGem,
    comp5: ItemsListByName.BloodGem,
    taskCrafted: TaskTypes.CraftBloodStaffs,
});

CraftingManager.addRecipe({ // Plain robe
    result: ItemsListByName.PlainRobe,
    craftingStat: StatNames.Armoury,
    stationType: EntitiesList.Workbench,
    comp1: ItemsListByName.Fabric,
    comp2: ItemsListByName.Fabric,
    taskCrafted: TaskTypes.CraftPlainRobes,
});

CraftingManager.addRecipe({ // Mage robe
    result: ItemsListByName.MageRobe,
    craftingStat: StatNames.Armoury,
    stationType: EntitiesList.Workbench,
    comp1: ItemsListByName.PlainRobe,
    comp3: ItemsListByName.Bluecap,
    taskCrafted: TaskTypes.CraftMageRobes,
});

CraftingManager.addRecipe({ // Necromancer robe
    result: ItemsListByName.NecromancerRobe,
    craftingStat: StatNames.Armoury,
    stationType: EntitiesList.Workbench,
    comp1: ItemsListByName.PlainRobe,
    comp3: ItemsListByName.NoctisOre,
    taskCrafted: TaskTypes.CraftNecromancerRobes,
});
