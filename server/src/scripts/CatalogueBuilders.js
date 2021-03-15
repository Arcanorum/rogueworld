const fs = require("fs");
const Utils = require("../Utils");
const DungeonManagersList = require("../dungeon/DungeonManagersList");

module.exports = {
    /**
     * Write the registered dungeons data to the client, so the client
     * knows what info to show for each dungeon a player tries to enter.
     */
    buildDungeonPrompts() {
        let dataToWrite = {};

        Object.values(DungeonManagersList.ByID).forEach((dungeonManager) => {
            // Add this dungeon info to the catalogue.
            dataToWrite[dungeonManager.id] = {
                id: dungeonManager.id,
                nameDefinitionID: dungeonManager.nameDefinitionID,
                difficulty: dungeonManager.difficultyName,
                gloryCost: dungeonManager.gloryCost,
                maxPlayers: dungeonManager.maxPlayers,
            };
        });

        // Turn the data into a string.
        dataToWrite = JSON.stringify(dataToWrite);

        Utils.checkClientCataloguesExists();

        // Write the data to the file in the client files.
        fs.writeFileSync("../client/src/catalogues/DungeonPrompts.json", dataToWrite);

        Utils.message("Dungeon prompts info catalogue written to file.");
    },
};
