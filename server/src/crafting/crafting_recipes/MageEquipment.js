const CraftingManager = require("../CraftingManager");
const EntitiesList = require("../../EntitiesList");
const ItemsList = require("../../ItemsList");
const { StatNames } = require("../../stats/Statset").prototype;
const TaskTypes = require("../../tasks/TaskTypes");

CraftingManager.addRecipe({ // Fire staff
    result: ItemsList.FireStaff,
    craftingStat: StatNames.Weaponry,
    stationType: EntitiesList.Workbench,
    comp1: ItemsList.OakLogs,
    comp2: ItemsList.OakLogs,
    comp3: ItemsList.OakLogs,
    comp4: ItemsList.FireGem,
    taskCrafted: TaskTypes.CraftFireStaffs,
});

CraftingManager.addRecipe({ // Super fire staff
    result: ItemsList.SuperFireStaff,
    craftingStat: StatNames.Weaponry,
    stationType: EntitiesList.Workbench,
    comp1: ItemsList.OakLogs,
    comp2: ItemsList.OakLogs,
    comp3: ItemsList.OakLogs,
    comp4: ItemsList.FireGem,
    comp5: ItemsList.FireGem,
    taskCrafted: TaskTypes.CraftFireStaffs,
});

CraftingManager.addRecipe({ // Wind staff
    result: ItemsList.WindStaff,
    craftingStat: StatNames.Weaponry,
    stationType: EntitiesList.Workbench,
    comp1: ItemsList.OakLogs,
    comp2: ItemsList.OakLogs,
    comp3: ItemsList.OakLogs,
    comp4: ItemsList.WindGem,
    taskCrafted: TaskTypes.CraftWindStaffs,
});

CraftingManager.addRecipe({ // Super wind staff
    result: ItemsList.SuperWindStaff,
    craftingStat: StatNames.Weaponry,
    stationType: EntitiesList.Workbench,
    comp1: ItemsList.OakLogs,
    comp2: ItemsList.OakLogs,
    comp3: ItemsList.OakLogs,
    comp4: ItemsList.WindGem,
    comp5: ItemsList.WindGem,
    taskCrafted: TaskTypes.CraftWindStaffs,
});

CraftingManager.addRecipe({ // Blood staff
    result: ItemsList.BloodStaff,
    craftingStat: StatNames.Weaponry,
    stationType: EntitiesList.Workbench,
    comp1: ItemsList.OakLogs,
    comp2: ItemsList.OakLogs,
    comp3: ItemsList.OakLogs,
    comp4: ItemsList.BloodGem,
    taskCrafted: TaskTypes.CraftBloodStaffs,
});

CraftingManager.addRecipe({ // Super blood staff
    result: ItemsList.SuperBloodStaff,
    craftingStat: StatNames.Weaponry,
    stationType: EntitiesList.Workbench,
    comp1: ItemsList.OakLogs,
    comp2: ItemsList.OakLogs,
    comp3: ItemsList.OakLogs,
    comp4: ItemsList.BloodGem,
    comp5: ItemsList.BloodGem,
    taskCrafted: TaskTypes.CraftBloodStaffs,
});

CraftingManager.addRecipe({ // Plain robe
    result: ItemsList.PlainRobe,
    craftingStat: StatNames.Armoury,
    stationType: EntitiesList.Workbench,
    comp1: ItemsList.Fabric,
    comp2: ItemsList.Fabric,
    taskCrafted: TaskTypes.CraftPlainRobes,
});

CraftingManager.addRecipe({ // Mage robe
    result: ItemsList.MageRobe,
    craftingStat: StatNames.Armoury,
    stationType: EntitiesList.Workbench,
    comp1: ItemsList.PlainRobe,
    comp3: ItemsList.Bluecap,
    taskCrafted: TaskTypes.CraftMageRobes,
});

CraftingManager.addRecipe({ // Necromancer robe
    result: ItemsList.NecromancerRobe,
    craftingStat: StatNames.Armoury,
    stationType: EntitiesList.Workbench,
    comp1: ItemsList.PlainRobe,
    comp3: ItemsList.NoctisOre,
    taskCrafted: TaskTypes.CraftNecromancerRobes,
});
