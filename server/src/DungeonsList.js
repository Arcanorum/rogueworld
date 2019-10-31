let idCounter = 1;

const DungeonsList = {
    ByID: {},
    ByName: {}
};

const Difficulties = {
    Beginner:   "Beginner",
    Advanced:   "Advanced",
    Expert:     "Expert",
    Master:     "Master",
};

class Dungeon {
    /**
     *
     * @param {String} name - What this dungeon is called. Used in Tiled to define what dungeon a dungeon door leads to.
     * @param {String} nameDefinitionID - The ID of the text definition to use for the name of this dungeon.
     * @param {String} [difficulty="Beginner"] - Roughly how difficult this dungeon is.
     * @param {Number} [gloryCost=0] - How much glory a player must pay to enter.
     */
    constructor (name, nameDefinitionID, difficulty, gloryCost) {
        this.id = idCounter;
        idCounter+=1;

        this.name = "dungeon-" + name;

        // Written to client to show the difficulty on the dungeon prompt.
        this.difficulty = difficulty || Difficulties.Beginner;

        // Written to client to show the dungeon name on the dungeon prompt.
        this.nameDefinitionID = "Dungeon name: " + nameDefinitionID;

        // Written to client to show the glory cost on the dungeon prompt.
        this.gloryCost = gloryCost || 0;

        // Easy to access references to this instance.
        DungeonsList.ByID[this.id] = this;
        DungeonsList.ByName[this.name] = this;

        /**
         * The exit used to get into this dungeon.
         * Max one per dungeon. Only one way to get in.
         * @type {DungeonPortal}
         */
        this.dungeonPortal = null;

        /**
         * The exit used to get out of this dungeon.
         * Max one per dungeon. Only one way to get out.
         * @type {OverworldPortal}
         */
        this.overworldPortal = null;

        /**
         * The boss that must be defeated first before the overworld portal activates.
         * @type {Boss}
         */
        this.boss = null;

        /**
         * Locked doors in dungeons stay open when unlocked, but are closed when the boss respawns.
         * @type {Interactable[]}
         */
        this.lockedDoors = [];

        /**
         * A list of the mobs that have keys in their drop lists, so they can be killed and respawned in their correct areas.
         * @type {Object}
         */
        this.keyHolders = {};
    }

    /**
     * Close this dungeon so no more players can enter it when the boss is defeated. Will be unlocked when the boss respawns.
     */
    lock () {
        // Open the exit of the dungeon so the players can leave.
        this.overworldPortal.activate();

        // Close the entrance to this dungeon so no more players can enter until the boss respawns.
        this.dungeonPortal.deactivate();

        // Remove the reference to the boss entity from the dungeon, as the entity actually gets destroyed, not recycled.
        this.boss = null;
    }

    /**
     * Open this dungeon so more players can enter it when the boss respawns.
     */
    unlock (boss) {
        // Set the given entity to be the boss of the dungeon it is in. Boss entities must only be spawned into boards that are dungeons.
        this.boss = boss;
        // Open the entrance of the dungeon so players can enter.
        this.dungeonPortal.activate();
        // Close the exit, so players cannot leave until this boss is defeated.
        this.overworldPortal.deactivate();
        // Reactivate all doors in this dungeon.
        for(let i=0; i<this.lockedDoors.length; i+=1){
            this.lockedDoors[i].activate();
        }
        // Kill all key holders.
        for(let keyHolderID in this.keyHolders){
            if(this.keyHolders.hasOwnProperty(keyHolderID) === false) continue;
            this.keyHolders[keyHolderID].destroy();
        }
        // Make a new list of key holders.
        this.keyHolders = {};
    }

}

new Dungeon("city-sewers",          "City sewers",          Difficulties.Beginner,  100);
new Dungeon("knight-training-arena","Knight training arena",Difficulties.Beginner,  200);
new Dungeon("bandit-hideout",       "Bandit hideout",       Difficulties.Beginner,  200);
new Dungeon("west-pyramid",         "West pyramid",         Difficulties.Advanced,  500);
new Dungeon("east-pyramid",         "East pyramid",         Difficulties.Expert,    1000);
new Dungeon("blood-halls",          "Blood halls",          Difficulties.Expert,    1000);
new Dungeon("shadow-dojo",          "Shadow dojo",          Difficulties.Master,    2000);
new Dungeon("forest-maze",          "Forest maze",          Difficulties.Master,    2000);


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