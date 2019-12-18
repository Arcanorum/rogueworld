
const DungeonsList = {
    ByID: {},
    ByName: {}
};

// Create a dungeon for each map that has dungeon config properties.
// const loadDungeon = (dataFileName) => {
//     const data = require('../map/' + dataFileName + '.json');
//     console.log("loading dungeon, data:", data);
// };

// const fs = require('fs');
// const dirs = fs.readdirSync('map', {encoding: 'utf-8', withFileTypes: true});
// const path = require('path');
// dirs.forEach((elem) => {
//     const parsed = path.parse(elem.name);
//     // Skip the blank template map.
//     if(parsed.name === "BLANK") return;
//     // Skip disabled maps. Anything with a # at the front.
//     if(parsed.name[0] === "#") {
//         console.log("* Skipping disabled map:", elem.name);
//         return;
//     }
//     // Only load JSON map data.
//     if(parsed.ext === ".json"){
//         loadDungeon(parsed.name);
//     }

// });

// new Dungeon("city-sewers",          "City sewers",          Difficulties.Beginner);
// new Dungeon("knight-training-arena","Knight training arena",Difficulties.Beginner);
// new Dungeon("bandit-hideout",       "Bandit hideout",       Difficulties.Beginner);
// new Dungeon("west-pyramid",         "West pyramid",         Difficulties.Advanced);
// new Dungeon("east-pyramid",         "East pyramid",         Difficulties.Expert);
// new Dungeon("blood-halls",          "Blood halls",          Difficulties.Expert);
// new Dungeon("shadow-dojo",          "Shadow dojo",          Difficulties.Master);
// new Dungeon("forest-maze",          "Forest maze",          Difficulties.Master);


// Write the registered entity types to the client, so the client knows what entity to add for each type number.
const fs = require('fs');
let dataToWrite = {};

for(let dungeonID in DungeonsList.ByID){
    // Don't check prototype properties.
    if(DungeonsList.ByID.hasOwnProperty(dungeonID) === false) continue;
    // Add this dungeon info to the catalogue.
    let dungeon = DungeonsList.ByID[dungeonID];
    dataToWrite[DungeonsList.ByID[dungeonID].id] = {
        id: dungeon.id,
        nameDefinitionID: dungeon.nameDefinitionID,
        difficulty: dungeon.difficulty,
        gloryCost: dungeon.gloryCost
    };
}

// Check the catalogue exists. Catches the case that this is the deployment server
// and thus doesn't have a client directory, and thus no catalogue.
if (fs.existsSync('../client/src/catalogues/DungeonPrompts.json')) {
    // Turn the data into a string.
    dataToWrite = JSON.stringify(dataToWrite);

    // Write the data to the file in the client files.
    fs.writeFileSync('../client/src/catalogues/DungeonPrompts.json', dataToWrite);

    console.log("* Dungeon prompts info catalogue written to file.");
}

module.exports = DungeonsList;