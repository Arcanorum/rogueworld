const CraftingManager = require("../CraftingManager");
const EntitiesList = require("../../EntitiesList");
const ItemsListByName = require("../../ItemsList").BY_NAME;
const { StatNames } = require("../../stats/Statset").prototype;
const TaskTypes = require("../../tasks/TaskTypes");

CraftingManager.addRecipe({
    name: "Dungium bar",
    result: ItemsListByName.DungiumBar,
    craftingStat: StatNames.Toolery,
    stationType: EntitiesList.Furnace,
    comp1: ItemsListByName.DungiumOre,
});

CraftingManager.addRecipe({
    name: "Dungium bar (recycle rod)",
    result: ItemsListByName.DungiumBar,
    craftingStat: StatNames.Toolery,
    stationType: EntitiesList.Furnace,
    comp1: ItemsListByName.DungiumRod,
    statXPGiven: 0,
});

CraftingManager.addRecipe({
    name: "Dungium bar (recycle sheet)",
    result: ItemsListByName.DungiumBar,
    craftingStat: StatNames.Toolery,
    stationType: EntitiesList.Furnace,
    comp1: ItemsListByName.DungiumSheet,
    statXPGiven: 0,
});

CraftingManager.addRecipe({
    name: "Dungium rod",
    result: ItemsListByName.DungiumRod,
    craftingStat: StatNames.Toolery,
    stationType: EntitiesList.Anvil,
    comp1: ItemsListByName.DungiumBar,
    statXPGiven: 0,
});

CraftingManager.addRecipe({
    name: "Dungium sheet",
    result: ItemsListByName.DungiumSheet,
    craftingStat: StatNames.Toolery,
    stationType: EntitiesList.Anvil,
    comp1: ItemsListByName.DungiumRod,
    statXPGiven: 0,
});

CraftingManager.addRecipe({
    name: "Dungium arrows",
    result: ItemsListByName.DungiumArrows,
    craftingStat: StatNames.Weaponry,
    stationType: EntitiesList.Workbench,
    comp1: ItemsListByName.DungiumRod,
    comp2: ItemsListByName.OakLogs,
    comp3: ItemsListByName.OakLogs,
    comp4: ItemsListByName.Feathers,
    taskCrafted: TaskTypes.CraftDungiumArrows,
});

CraftingManager.addRecipe({
    name: "Dungium pickaxe",
    result: ItemsListByName.DungiumPickaxe,
    craftingStat: StatNames.Toolery,
    stationType: EntitiesList.Anvil,
    comp1: ItemsListByName.OakLogs,
    comp2: ItemsListByName.OakLogs,
    comp3: ItemsListByName.DungiumRod,
    taskCrafted: TaskTypes.CraftDungiumPickaxes,
});

CraftingManager.addRecipe({
    name: "Dungium hatchet",
    result: ItemsListByName.DungiumHatchet,
    craftingStat: StatNames.Toolery,
    stationType: EntitiesList.Anvil,
    comp1: ItemsListByName.OakLogs,
    comp2: ItemsListByName.OakLogs,
    comp3: ItemsListByName.DungiumSheet,
    taskCrafted: TaskTypes.CraftDungiumHatchets,
});

CraftingManager.addRecipe({
    name: "Dungium dagger",
    result: ItemsListByName.DungiumDagger,
    craftingStat: StatNames.Weaponry,
    stationType: EntitiesList.Anvil,
    comp1: ItemsListByName.DungiumBar,
    comp2: ItemsListByName.DungiumBar,
    taskCrafted: TaskTypes.CraftDungiumDaggers,
});

CraftingManager.addRecipe({
    name: "Dungium sword",
    result: ItemsListByName.DungiumSword,
    craftingStat: StatNames.Weaponry,
    stationType: EntitiesList.Anvil,
    comp1: ItemsListByName.DungiumBar,
    comp2: ItemsListByName.DungiumBar,
    comp3: ItemsListByName.DungiumBar,
    taskCrafted: TaskTypes.CraftDungiumSwords,
});

CraftingManager.addRecipe({
    name: "Dungium hammer",
    result: ItemsListByName.DungiumHammer,
    craftingStat: StatNames.Weaponry,
    stationType: EntitiesList.Anvil,
    comp1: ItemsListByName.OakLogs,
    comp2: ItemsListByName.OakLogs,
    comp3: ItemsListByName.DungiumBar,
    comp4: ItemsListByName.DungiumBar,
    taskCrafted: TaskTypes.CraftDungiumHammers,
});

CraftingManager.addRecipe({
    name: "Dungium armour",
    result: ItemsListByName.DungiumArmour,
    craftingStat: StatNames.Armoury,
    stationType: EntitiesList.Anvil,
    comp1: ItemsListByName.DungiumSheet,
    comp2: ItemsListByName.DungiumSheet,
    comp3: ItemsListByName.DungiumSheet,
    comp4: ItemsListByName.DungiumSheet,
    comp5: ItemsListByName.DungiumSheet,
    taskCrafted: TaskTypes.CraftDungiumArmour,
});
