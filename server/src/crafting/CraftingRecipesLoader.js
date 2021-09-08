const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const { v4: uuidv4 } = require("uuid");
const Utils = require("../Utils");
const ItemsList = require("../items/ItemsList");
const CraftingRecipesList = require("./CraftingRecipesList");
const CraftingRecipe = require("./CraftingRecipe");
const Statset = require("../stats/Statset");
const EntitiesList = require("../entities/EntitiesList");

const populateList = () => {
    Utils.message("Populating crafting recipes list.");

    try {
        // Load all of the recipe configs.
        const recipeConfigs = yaml.safeLoad(
            fs.readFileSync(
                path.resolve("./src/configs/CraftingRecipes.yml"), "utf8",
            ),
        );

        recipeConfigs.forEach((config) => {
            const ResultItemType = ItemsList.BY_NAME[config.result.itemName];

            const craftingRecipeConfig = {
                stationTypes: [],
                statNames: config.stats,
                expGiven: config.expGiven,
                ingredients: [],
                result: {
                    ItemType: ResultItemType,
                    baseQuantity: config.result.baseQuantity,
                    baseDurability: config.result.baseDurability,
                },
            };

            // Check all of the crafting station types used in the recipe are valid crafting stations.
            config.stationTypes.forEach((stationTypeName) => {
                // Check it is actually a crafting station type, and not some other entity type.
                if (
                    !EntitiesList[stationTypeName]
                    || !(
                        EntitiesList[stationTypeName].prototype
                        instanceof EntitiesList.CraftingStation
                    )) {
                    Utils.error("Invalid crafting recipe. Crafting station type doesnt exist in the entity types list for stationTypeName:", stationTypeName);
                }

                craftingRecipeConfig.stationTypes.push(EntitiesList[stationTypeName]);
            });

            if (config.stats) {
                // Check all of the stat names used in the recipe are valid stats.
                config.stats.forEach((statName) => {
                    if (!Statset.prototype.StatNames[statName]) {
                        Utils.error("Invalid crafting recipe. Stat name isn't a valid stat:", statName);
                    }
                });
            }

            // Check all of the ingredients have a quantity set, or default to 1.
            config.ingredients.forEach((ingredient) => {
                if (!ingredient.quantity) ingredient.quantity = 1;
            });

            // Check the exp given is a positive number.
            if (config.expGiven && (
                !Number.isFinite(config.expGiven) || config.expGiven < 0)
            ) {
                Utils.error("Invalid crafting recipe. Exp given isn't a positive number:", config.expGiven);
            }

            // If no exp amount is given, use the sum of the ingredients.
            if (!config.expGiven) {
                let totalIngredientsExp = 0;

                config.ingredients.forEach((ingredient) => {
                    const IngredientType = ItemsList.BY_NAME[ingredient.itemName];

                    if (!IngredientType) {
                        Utils.error(`Invalid crafting recipe. Ingredient of given item type name not found in the items list: \`${ingredient.itemName}\` in recipe:`, config);
                    }

                    totalIngredientsExp += (
                        IngredientType.prototype.craftingExpValue
                        * ingredient.quantity
                    );
                });

                craftingRecipeConfig.expGiven = totalIngredientsExp;
            }

            // Check all of the item names used in the recipe are valid items.
            config.ingredients.forEach((ingredient) => {
                if (!ItemsList.BY_NAME[ingredient.itemName]) {
                    Utils.error("Invalid crafting recipe. Ingredient item type doesn't exist in the item types list for itemName:", ingredient.itemName);
                }

                craftingRecipeConfig.ingredients.push({
                    ItemType: ItemsList.BY_NAME[ingredient.itemName],
                    quantity: ingredient.quantity,
                });
            });

            // Check the item type to craft is a valid item.
            if (!ResultItemType) {
                Utils.error("Invalid crafting recipe. Result item type doesn't exist in the item types list for itemName:", config.result.itemName);
            }

            // Check for this common mistake.
            if (config.result.quantity) {
                Utils.error("Invalid crafting recipe. 'quantity' given for result. Did you mean 'baseQuantity'? Result config:", config.result);
            }
            if (config.result.durability) {
                Utils.error("Invalid crafting recipe. 'durability' given for result. Did you mean 'baseDurability'? Result config:", config.result);
            }
            // Check the item type to craft can have the given quantity or durability property (is stackable or not).
            if (config.result.baseQuantity) {
                if (!ResultItemType.prototype.baseQuantity) {
                    Utils.error("Invalid crafting recipe. Result base quantity given for an unstackable item type. Result config:", config.result);
                }
            }
            if (config.result.baseDurability) {
                if (!ResultItemType.prototype.baseDurability) {
                    Utils.error("Invalid crafting recipe. Result base durability given for a stackable item type. Result config:", config.result);
                }
            }

            // Check the weight of the item to craft is not more than the total weight of the ingredients,
            // or they might end up with more than max carry weight after crafting.
            {
                let totalIngredientsWeight = 0;

                let resultWeight = ResultItemType.prototype.unitWeight;

                // If it is a stackable, calculate the total weight of the stack.
                if (config.result.baseQuantity) {
                    resultWeight *= config.result.baseQuantity;
                }

                config.ingredients.forEach((ingredient) => {
                    totalIngredientsWeight += (
                        ItemsList.BY_NAME[ingredient.itemName].prototype.unitWeight
                        * ingredient.quantity
                    );
                });

                if (resultWeight > totalIngredientsWeight) {
                    Utils.error(`Invalid crafting recipe. Result item weight (${resultWeight}) is greater than the total ingredients weight (${totalIngredientsWeight}) for recipe config:`, config);
                }
            }

            CraftingRecipesList.push(new CraftingRecipe(craftingRecipeConfig));
        });
    }
    catch (error) {
        Utils.error(error);
    }

    Utils.message("Finished populating crafting recipes list.");
};

const createCatalogue = () => {
    // Write the recipes to the client.
    let dataToWrite = [];

    Object.values(CraftingRecipesList).forEach((craftingRecipe, index) => {
        // Add this recipe to the recipes catalogue.
        dataToWrite.push({
            // Add a unique id to stop React crying when this recipe is used in displaying a list...
            id: uuidv4(),
            index, // Add the index of this entry in the recipes list, so the client can send it to identify the recipe when crafting.
            stationTypeNumbers: craftingRecipe.stationTypes.map(
                (stationType) => stationType.prototype.typeNumber,
            ),
            ingredients: craftingRecipe.ingredients.map(
                (ingredient) => ({
                    id: uuidv4(), // To shut React up...
                    itemTypeCode: ingredient.ItemType.prototype.typeCode,
                    quantity: ingredient.quantity,
                }),
            ),
            result: {
                itemTypeCode: craftingRecipe.result.ItemType.prototype.typeCode,
                baseQuantity: craftingRecipe.result.baseQuantity,
                baseDurability: craftingRecipe.result.baseDurability,
            },
        });
    });

    dataToWrite = JSON.stringify(dataToWrite);

    Utils.checkClientCataloguesExists();

    // Write the data to the file in the client files.
    fs.writeFileSync("../client/src/catalogues/CraftingRecipes.json", dataToWrite);

    Utils.message("Crafting recipes catalogue written to file.");
};

module.exports = {
    populateList,
    createCatalogue,
};
