
const Utils = require('./Utils');

const Difficulties = {};

class Difficulty {
    constructor(name, gloryCost) {
        // If a dungeon already exists with the given name, stop the server.
        if(Difficulties[name]) Utils.error('Difficulty name is already taken:' + name);
        this.name = name;

        this.gloryCost = gloryCost || 0;
    }
}

Difficulties.Beginner = new Difficulty("Beginner", 200);
Difficulties.Advanced = new Difficulty("Advanced", 500);
Difficulties.Expert =   new Difficulty("Expert", 1000);
Difficulties.Master =   new Difficulty("Master", 5000);

let idCounter = 1;

class Dungeon {
    /**
     *
     * @param {String} name - What this dungeon is called. Used in Tiled to define what dungeon a dungeon door leads to.
     * @param {String} nameDefinitionID - The ID of the text definition to use for the name of this dungeon.
     * @param {String} [difficulty=Difficulties.Beginner] - Roughly how difficult this dungeon is relative to most others.
     */
    constructor (name, nameDefinitionID, difficultyName) {
        this.id = idCounter;
        idCounter+=1;

        this.name = name;

        let difficulty = Difficulties.Beginner;
        // Use the given difficulty name map setting if given.
        if(difficultyName){
            difficulty = Difficulties[difficultyName];
            // Check the given difficulty name is valid.
            if(!difficulty) Utils.error(
                "Dungeon difficulty name is invalid.",
                "Difficulty name: ", difficultyName +
                ". On map:", name,
                '\nValid difficulties:\n', Difficulties
            );
        }

        /**
         * Written to client to show the difficulty on the dungeon prompt.
         * @type {String}
         */
        this.difficultyName = difficulty.name;

        /**
         * Written to client to show the dungeon name on the dungeon prompt.
         * @type {String}
         */
        this.nameDefinitionID = "Dungeon name: " + nameDefinitionID;

        /**
         * How much glory a player must pay to enter.
         * Written to client to show the glory cost on the dungeon prompt.
         * @type {Number}
         */
        this.gloryCost = difficulty.gloryCost || 0;

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

module.exports = Dungeon;

const DungeonsList = require('./DungeonsList');