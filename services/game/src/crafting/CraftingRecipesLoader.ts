import { CraftingRecipes, CraftingStationClasses } from '@rogueworld/configs';
import { CraftingRecipeClientConfig } from '@rogueworld/types/src/CraftingRecipeClientConfig';
// import Statset from '../stats/Statset';
import { error, message } from '@rogueworld/utils';
import { ensureDirSync, writeFileSync } from 'fs-extra';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import ItemsList from '../items/ItemsList';
import CraftingRecipe from './CraftingRecipe';
import CraftingRecipesList from './CraftingRecipesList';

interface CraftingRecipeConfig {
    ingredients: Array<{ itemName: string; quantity: number }>;
    result: {
        itemName: string;
        baseQuantity: number;
        // Invalid property check.
        quantity?: boolean;
    };
    stationClasses?: Array<string>;
    stats?: Array<string>;
    expGiven?: number;
}

export const populateList = () => {
    message('Populating crafting recipes list.');

    try {
        CraftingRecipes.forEach((config: CraftingRecipeConfig) => {
            const ResultItemType = ItemsList.BY_NAME[config.result.itemName];

            if (!ResultItemType) {
                error('Invalid crafting recipe. Result item type doesn\'t exist in the item types list for itemName:', config.result.itemName);
            }

            const craftingRecipe: CraftingRecipe = {
                stationClasses: config.stationClasses || [],
                statNames: config.stats || [],
                expGiven: config.expGiven || 0,
                ingredients: [],
                result: {
                    ItemType: ResultItemType,
                    baseQuantity: config.result.baseQuantity || ResultItemType.baseQuantity,
                },
            };

            // Check all of the crafting station classes used in the recipe are valid.
            craftingRecipe.stationClasses?.forEach((stationClass) => {
                if (!CraftingStationClasses.includes(stationClass)) {
                    error('Invalid crafting recipe. Crafting station type doesn\'t exist in the entity types list for stationTypeName:', stationClass);
                }
            });

            // if (config.stats) { TODO: not using stats anymore?
            //     // Check all of the stat names used in the recipe are valid stats.
            //     config.stats.forEach((statName) => {
            //         if (!Statset.prototype.StatNames[statName]) {
            //             error('Invalid crafting recipe. Stat name isn\'t a
            //                 valid stat:', statName);
            //         }
            //     });
            // }

            // Check all of the item names used in the recipe are valid items.
            config.ingredients.forEach((ingredient) => {
                if (!ItemsList.BY_NAME[ingredient.itemName]) {
                    error('Invalid crafting recipe. Ingredient item type doesn\'t exist in the item types list for itemName:', ingredient.itemName);
                }

                craftingRecipe.ingredients.push({
                    ItemType: ItemsList.BY_NAME[ingredient.itemName],
                    // Make sure ingredients have a quantity set, or default to 1.
                    quantity: ingredient.quantity || 1,
                });
            });

            // Check the exp given is a positive number.
            if (config.expGiven && (
                !Number.isFinite(config.expGiven) || config.expGiven < 0)
            ) {
                error('Invalid crafting recipe. Exp given isn\'t a positive number:', config.expGiven);
            }

            // If no exp amount is given, use the sum of the ingredients.
            if (!config.expGiven) {
                let totalIngredientsExp = 0;

                craftingRecipe.ingredients.forEach((ingredient) => {
                    totalIngredientsExp += (
                        ingredient.ItemType.craftingExpValue * ingredient.quantity
                    );
                });

                craftingRecipe.expGiven = totalIngredientsExp;
            }

            // Check the item type to craft is a valid item.
            if (!ResultItemType) {
                error('Invalid crafting recipe. Result item type doesn\'t exist in the item types list for itemName:', config.result.itemName);
            }

            // Check for this common mistake.
            if (config.result.quantity) {
                error('Invalid crafting recipe. \'quantity\' given for result. Did you mean \'baseQuantity\'? Result config:', config.result);
            }

            // Check the weight of the item to craft is not more than the total weight of the
            // ingredients, or they might end up with more than max carry weight after crafting.
            {
                let totalIngredientsWeight = 0;

                let resultWeight = ResultItemType.unitWeight;

                // Calculate the total weight of the stack.
                resultWeight *= config.result.baseQuantity;

                config.ingredients.forEach((ingredient) => {
                    totalIngredientsWeight += (
                        ItemsList.BY_NAME[ingredient.itemName].unitWeight
                        * ingredient.quantity
                    );
                });

                if (resultWeight > totalIngredientsWeight) {
                    error(`Invalid crafting recipe. Result item weight (${resultWeight}) is greater than the total ingredients weight (${totalIngredientsWeight}) for recipe config:`, config);
                }
            }

            CraftingRecipesList.push(craftingRecipe);
        });
    }
    catch (err) {
        error(err);
    }

    message('Finished populating crafting recipes list.');
};

export const createCatalogue = () => {
    // Write the recipes to the client.
    const dataToWrite: Array<CraftingRecipeClientConfig> = [];

    Object.values(CraftingRecipesList).forEach((craftingRecipe, index) => {
        // Add this recipe to the recipes catalogue.
        dataToWrite.push({
            // Add a unique id to stop React crying when this recipe is used in displaying a list...
            id: uuidv4(),
            // Add the index of this entry in the recipes list, so the client can send it to
            // identify the recipe when crafting.
            index,
            stationClasses: craftingRecipe.stationClasses,
            ingredients: craftingRecipe.ingredients.map(
                (ingredient) => ({
                    id: uuidv4(), // To shut React up...
                    itemTypeCode: ingredient.ItemType.typeCode,
                    quantity: ingredient.quantity,
                }),
            ),
            result: {
                itemTypeCode: craftingRecipe.result.ItemType.typeCode,
                baseQuantity: craftingRecipe.result.baseQuantity,
            },
        });
    });

    const outputPath = path.join(__dirname, '../api/resources/catalogues');

    ensureDirSync(outputPath);

    writeFileSync(`${outputPath}/CraftingRecipes.json`, JSON.stringify(dataToWrite));

    message('Crafting recipes catalogue written to file.');
};
