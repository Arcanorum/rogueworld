const fs = require("fs");
const Utils = require("../Utils");
const CraftingManager = require("./CraftingManager");

require("./crafting_recipes/ClanStructures");
require("./crafting_recipes/DungiumEquipment");
require("./crafting_recipes/IronEquipment");
require("./crafting_recipes/MageEquipment");
require("./crafting_recipes/Materials");
require("./crafting_recipes/NoctisEquipment");
require("./crafting_recipes/Potions");
require("./crafting_recipes/RangedEquipment");

// Write all of the recipes to the client, so the client knows when a valid recipe has been created from the crafting components.
let dataToWrite = {};

let station;

for (const stationKey in CraftingManager.StationRecipes) {
    // Don't check prototype properties.
    if (CraftingManager.StationRecipes.hasOwnProperty(stationKey) === false) continue;
    station = CraftingManager.StationRecipes[stationKey];

    dataToWrite[stationKey] = {};

    for (const recipeKey in station) {
        if (station.hasOwnProperty(recipeKey) === false) continue;

        if (!station[recipeKey].result) {
            console.log(station[recipeKey]);
            Utils.error(`Cannot add crafting recipe for recipe combo "${recipeKey}" in station "${station[recipeKey]}"`);
        }
        // Add this recipe to the catalogue.
        dataToWrite[stationKey][recipeKey] = {
            resultTypeNumber: station[recipeKey].result.prototype.typeCode,
            // stationTypeNumber: recipe.stationTypeNumber
        };
    }
}

// Turn the data into a string.
dataToWrite = JSON.stringify(dataToWrite);

Utils.checkClientCataloguesExists();

// Write the data to the file in the client files.
fs.writeFileSync("../client/src/catalogues/CraftingRecipes.json", dataToWrite);

Utils.message("Crafting recipes catalogue written to file.");
