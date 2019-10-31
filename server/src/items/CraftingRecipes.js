
const CraftingManager = require('./CraftingManager');
const EntitiesList = require('../entities/EntitiesList');
const ItemsList = require('./ItemsList');
const StatNames = require('../stats/Statset').prototype.StatNames;
const TaskTypes = require('../tasks/TaskTypes');

require('./crafting recipes/ClanStructures');
require('./crafting recipes/DungiumEquipment');
require('./crafting recipes/IronEquipment');
require('./crafting recipes/MageEquipment');
require('./crafting recipes/Materials');
require('./crafting recipes/NoctisEquipment');
require('./crafting recipes/Potions');
require('./crafting recipes/RangedEquipment');


// Write all of the recipes to the client, so the client knows when a valid recipe has been created from the crafting components.
const fs = require('fs');
let dataToWrite = {};

let station;

for(let stationKey in CraftingManager.StationRecipes){
    // Don't check prototype properties.
    if(CraftingManager.StationRecipes.hasOwnProperty(stationKey) === false) continue;
    station = CraftingManager.StationRecipes[stationKey];

    dataToWrite[stationKey] = {};

    for(let recipeKey in station){
        if(station.hasOwnProperty(recipeKey) === false) continue;

        // Add this recipe to the catalogue.
        dataToWrite[stationKey][recipeKey] = {
            resultTypeNumber: station[recipeKey].result.prototype.typeNumber
            //stationTypeNumber: recipe.stationTypeNumber
        };
    }
}

// Check the type catalogue exists. Catches the case that this is the deployment server
// and thus doesn't have a client directory, and thus no catalogue.
if (fs.existsSync('../client/src/catalogues/CraftingRecipes.json')) {
    // Turn the data into a string.
    dataToWrite = JSON.stringify(dataToWrite);

    // Write the data to the file in the client files.
    fs.writeFileSync('../client/src/catalogues/CraftingRecipes.json', dataToWrite);

    console.log("* Crafting recipes catalogue written to file.");
}