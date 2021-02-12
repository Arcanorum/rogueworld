const Utils = require("../Utils");

const clanManager = {

    // The in-memory store of all clans.
    clans: {},

    addClan(clan) {
        // Store the clan by its charter ID.
        this.clans[clan.charter.id] = clan;
    },

    removeClan(clan) {
        delete this.clans[clan.charter.id];
    },

    loadDataFromFile() {
        let data = fs.readFileSync("./ClansData.json", "utf8");
        // console.log("loaded clans data:", data);
        data = JSON.parse(data);
        // console.log("parsed clans data:", data);

        if (Charter === undefined) return;

        // For every clan in the data.
        // Add the clans and their structures back the to game world.
        for (let i = 0; i < data.length; i += 1) {
            const clanData = data[i];
            // Create the charter.
            // Check the tile is buildable. Map might have been changed since this structure was built.
            if (boardsObject.overworld.isTileBuildable(clanData.charterRow, clanData.charterCol) === false) continue;
            const charter = new Charter({ row: clanData.charterRow, col: clanData.charterCol });
            // Create the other structures.
            for (let j = 0; j < clanData.structures.length; j += 1) {
                const structure = clanData.structures[j];
                // Check that type of structure still exists. Might have been removed since the clan was saved.
                if (EntitiesList[structure.typeName] === undefined) continue;
                // Clan structures should have only been built on the overworld board.
                // Check the tile is buildable. Map have been changed since this structure was built.
                if (charter.board.isTileBuildable(structure.row, structure.col) === false) continue;
                // Add the structure entity to the world.
                new EntitiesList[structure.typeName]({
                    row: structure.row, col: structure.col, board: charter.board, clan: charter.clan,
                });
            }
        }

        Utils.message("Loaded clans added.");
    },

    /**
     * Save all of the clans data to file.
     */
    saveDataToFile() {
        const data = [];
        // If there are no clans, or no clans were loaded, do not save over the clans data.
        if (Object.keys(this.clans).length === 0) {
            Utils.message("No clans data to save. Skipping.");
            return;
        }

        // For every clan that exists.
        for (const clanKey in this.clans) {
            if (this.clans.hasOwnProperty(clanKey) === false) continue;
            /** @type {Clan} */
            const clan = this.clans[clanKey];
            const structures = [];
            // Get the type and position of each structure.
            for (const structureKey in clan.structures) {
                structures.push({
                    typeName: clan.structures[structureKey].constructor.name,
                    row: clan.structures[structureKey].row,
                    col: clan.structures[structureKey].col,
                });
            }

            data.push({
                charterRow: clan.charter.row,
                charterCol: clan.charter.col,
                structures,
                power: clan.power,
            });
        }

        // console.log("- - - clans data to save:", data);

        // Save everything to file.
        try {
            fs.writeFileSync("./ClansData.json", JSON.stringify(data));
        }
        catch (err) {
            console.log(`Error writing ClansData.json:${err.message}`);
        }

        Utils.message("Clans data saved");
    },

};

module.exports = clanManager;

const fs = require("fs");

const Charter = undefined; // require('./entities/statics/interactables/crafting stations/Charter');
const EntitiesList = require("../EntitiesList");
const { boardsObject } = require("../board/BoardsList");
