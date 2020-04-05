
const fs = require('fs');
const DungeonManagersList = require('./dungeon/DungeonManagersList');

module.exports = {
    /**
     * Write the registered dungeons data to the client, so the client 
     * knows what info to show for each dungeon a player tries to enter.
     */
    buildDungeonPrompts () {
                
        let dataToWrite = {};

        for(let dungeonID in DungeonManagersList.ByID){
            // Don't check prototype properties.
            if(DungeonManagersList.ByID.hasOwnProperty(dungeonID) === false) continue;
            // Add this dungeon info to the catalogue.
            let dungeon = DungeonManagersList.ByID[dungeonID];
            dataToWrite[DungeonManagersList.ByID[dungeonID].id] = {
                id: dungeon.id,
                nameDefinitionID: dungeon.nameDefinitionID,
                difficulty: dungeon.difficultyName,
                gloryCost: dungeon.gloryCost
            };
        }

        // Turn the data into a string.
        dataToWrite = JSON.stringify(dataToWrite);

        require('./Utils').checkClientCataloguesExists();

        // Write the data to the file in the client files.
        fs.writeFileSync('../client/src/catalogues/DungeonPrompts.json', dataToWrite);

        console.log("* Dungeon prompts info catalogue written to file.");
    }
}
