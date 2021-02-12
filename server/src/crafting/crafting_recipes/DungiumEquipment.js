const CraftingManager = require("../CraftingManager");
const EntitiesList = require("../../EntitiesList");
const ItemsList = require("../../ItemsList");
const { StatNames } = require("../../stats/Statset").prototype;
const TaskTypes = require("../../tasks/TaskTypes");

CraftingManager.addRecipe({
    name: "Dungium bar",
    result: ItemsList.DungiumBar,
    craftingStat: StatNames.Toolery,
    stationType: EntitiesList.Furnace,
    comp1: ItemsList.DungiumOre,
});

CraftingManager.addRecipe({
    name: "Dungium bar (recycle rod)",
    result: ItemsList.DungiumBar,
    craftingStat: StatNames.Toolery,
    stationType: EntitiesList.Furnace,
    comp1: ItemsList.DungiumRod,
    statXPGiven: 0,
});

CraftingManager.addRecipe({
    name: "Dungium bar (recycle sheet)",
    result: ItemsList.DungiumBar,
    craftingStat: StatNames.Toolery,
    stationType: EntitiesList.Furnace,
    comp1: ItemsList.DungiumSheet,
    statXPGiven: 0,
});

CraftingManager.addRecipe({
    name: "Dungium rod",
    result: ItemsList.DungiumRod,
    craftingStat: StatNames.Toolery,
    stationType: EntitiesList.Anvil,
    comp1: ItemsList.DungiumBar,
    statXPGiven: 0,
});

CraftingManager.addRecipe({
    name: "Dungium sheet",
    result: ItemsList.DungiumSheet,
    craftingStat: StatNames.Toolery,
    stationType: EntitiesList.Anvil,
    comp1: ItemsList.DungiumRod,
    statXPGiven: 0,
});

CraftingManager.addRecipe({
    name: "Dungium arrows",
    result: ItemsList.DungiumArrows,
    craftingStat: StatNames.Weaponry,
    stationType: EntitiesList.Workbench,
    comp1: ItemsList.DungiumRod,
    comp2: ItemsList.OakLogs,
    comp3: ItemsList.OakLogs,
    comp4: ItemsList.Feathers,
    taskCrafted: TaskTypes.CraftDungiumArrows,
});

CraftingManager.addRecipe({
    name: "Dungium pickaxe",
    result: ItemsList.DungiumPickaxe,
    craftingStat: StatNames.Toolery,
    stationType: EntitiesList.Anvil,
    comp1: ItemsList.OakLogs,
    comp2: ItemsList.OakLogs,
    comp3: ItemsList.DungiumRod,
    taskCrafted: TaskTypes.CraftDungiumPickaxes,
});

CraftingManager.addRecipe({
    name: "Dungium hatchet",
    result: ItemsList.DungiumHatchet,
    craftingStat: StatNames.Toolery,
    stationType: EntitiesList.Anvil,
    comp1: ItemsList.OakLogs,
    comp2: ItemsList.OakLogs,
    comp3: ItemsList.DungiumSheet,
    taskCrafted: TaskTypes.CraftDungiumHatchets,
});

CraftingManager.addRecipe({
    name: "Dungium dagger",
    result: ItemsList.DungiumDagger,
    craftingStat: StatNames.Weaponry,
    stationType: EntitiesList.Anvil,
    comp1: ItemsList.DungiumBar,
    comp2: ItemsList.DungiumBar,
    taskCrafted: TaskTypes.CraftDungiumDaggers,
});

CraftingManager.addRecipe({
    name: "Dungium sword",
    result: ItemsList.DungiumSword,
    craftingStat: StatNames.Weaponry,
    stationType: EntitiesList.Anvil,
    comp1: ItemsList.DungiumBar,
    comp2: ItemsList.DungiumBar,
    comp3: ItemsList.DungiumBar,
    taskCrafted: TaskTypes.CraftDungiumSwords,
});

CraftingManager.addRecipe({
    name: "Dungium hammer",
    result: ItemsList.DungiumHammer,
    craftingStat: StatNames.Weaponry,
    stationType: EntitiesList.Anvil,
    comp1: ItemsList.OakLogs,
    comp2: ItemsList.OakLogs,
    comp3: ItemsList.DungiumBar,
    comp4: ItemsList.DungiumBar,
    taskCrafted: TaskTypes.CraftDungiumHammers,
});

CraftingManager.addRecipe({
    name: "Dungium armour",
    result: ItemsList.DungiumArmour,
    craftingStat: StatNames.Armoury,
    stationType: EntitiesList.Anvil,
    comp1: ItemsList.DungiumSheet,
    comp2: ItemsList.DungiumSheet,
    comp3: ItemsList.DungiumSheet,
    comp4: ItemsList.DungiumSheet,
    comp5: ItemsList.DungiumSheet,
    taskCrafted: TaskTypes.CraftDungiumArmour,
});
