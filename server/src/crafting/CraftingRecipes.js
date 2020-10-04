const Utils = require("../Utils");
const CraftingManager = require('./CraftingManager');

require('./crafting_recipes/ClanStructures');
require('./crafting_recipes/DungiumEquipment');
require('./crafting_recipes/IronEquipment');
require('./crafting_recipes/MageEquipment');
require('./crafting_recipes/Materials');
require('./crafting_recipes/NoctisEquipment');
require('./crafting_recipes/Potions');
require('./crafting_recipes/RangedEquipment');

// Write all of the recipes to the client, so the client knows when a valid recipe has been created from the crafting components.
const fs = require('fs');
let dataToWrite = {};

let station;

for (let stationKey in CraftingManager.StationRecipes) {
    // Don't check prototype properties.
    if (CraftingManager.StationRecipes.hasOwnProperty(stationKey) === false) continue;
    station = CraftingManager.StationRecipes[stationKey];

    dataToWrite[stationKey] = {};

    for (let recipeKey in station) {
        if (station.hasOwnProperty(recipeKey) === false) continue;

        // Add this recipe to the catalogue.
        dataToWrite[stationKey][recipeKey] = {
            resultTypeNumber: station[recipeKey].result.prototype.typeNumber
            //stationTypeNumber: recipe.stationTypeNumber
        };
    }
}

// Turn the data into a string.
dataToWrite = JSON.stringify(dataToWrite);

Utils.checkClientCataloguesExists();

// Write the data to the file in the client files.
fs.writeFileSync('../client/src/catalogues/CraftingRecipes.json', dataToWrite);

Utils.message("Crafting recipes catalogue written to file.");