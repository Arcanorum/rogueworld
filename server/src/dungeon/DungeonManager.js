const Utils = require('../Utils');
const Difficulties = require('./Difficulties');

const idCounter = new Utils.Counter();

class DungeonManager {
    /**
     * @param {Object} config
     * @param {String} config.name - What this dungeon is called. Used in Tiled to define what dungeon a dungeon door leads to.
     * @param {String} config.nameDefinitionID - The ID of the text definition to use for the name of this dungeon.
     * @param {Object} config.mapData
     * @param {Boolean} [config.alwaysNight=true]
     * @param {Number} [config.maxPlayers=6] - How many players can enter this instance.
     * @param {Number} [config.timeLimitMinutes=30]
     * @param {String} [config.difficultyName=Difficulties.Beginner] - Roughly how difficult this dungeon is relative to most others.
     */
    constructor (config) {
        console.log("creating dungeon manager:", config.name);

        /**
         * A generic unique ID for this dungeon manager.
         * @type {Number}
         */
        this.id = idCounter.getNext();

        this.name = config.name || "";
        this.nameDefinitionID = config.nameDefinitionID || "";

        // The data to give the dungeon instances, so it knows how to build it's board.
        this.boardConfig = {
            name: config.name,
            mapData: config.mapData,
            alwaysNight: config.alwaysNight || true
        };

        this.maxPlayers = config.maxPlayers || 6;
        this.timeLimitMinutes = config.timeLimitMinutes || 30;
        this.difficultyName = config.difficultyName || "";

        /**
         * The list of active dungeon instances that this manager is responsible for, by their ID.
         * @type {Object.<Dungeon>}
         */
        this.instances = {};


        this.parties = {};

        // Easy to access references to this instance.
        DungeonManagersList.ByID[this.id] = this;
        DungeonManagersList.ByName[this.name] = this;

        let difficulty = Difficulties.Beginner;
        // Use the given difficulty name map setting if given.
        if(config.difficultyName){
            difficulty = Difficulties[config.difficultyName];
            // Check the given difficulty name is valid.
            if(!difficulty) Utils.error(
                "Dungeon difficulty name is invalid.",
                "Difficulty name: ", config.difficultyName +
                ". On map:", config.name,
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
        this.nameDefinitionID = "Dungeon name: " + config.nameDefinitionID;

        /**
         * How much glory a player must pay to enter.
         * Written to client to show the glory cost on the dungeon prompt.
         * @type {Number}
         */
        this.gloryCost = difficulty.gloryCost || 0;
    }

    createParty (player) {
        const party = new Party(this, player);
        this.parties[party.id] = party;
    }

    removeParty (party) {
        delete this.parties[party.id];
    }

    /**
     * Attempt to start a dungeon instance for a party of players.
     * @param {Array.<Player>} players - A list of player entities.
     * @param {dungeonPortal} dungeonPortal - The dungeon portal entity that this start was initiated from.
     */
    start (players, dungeonPortal) {
        if(this.checkStartCriteria(players, dungeonPortal) === false) return;

        const instance = this.createInstance(players);

        // Move the party of players into a dungeon instance.
        players.forEach((player) => {
            // Reposition them to somewhere within the entrance bounds.
            let position = instance.board.entrances["dungeon-start"].getRandomPosition();

            // Move the player to the board instance that was created.
            player.changeBoard(instance.board, position.row, position.col);
        });

    }

    createInstance (players) {
        if(players.length > this.maxPlayers){
            Utils.error("Players list is larger than the max players for this dungeon.");
        }

        // Create a board instance from the map data.
        const instance = new Dungeon({
            name: this.boardConfig.name,
            mapData: this.boardConfig.mapData,
            alwaysNight: this.boardConfig.alwaysNight,
            timeLimitMinutes: this.timeLimitMinutes
        });

        this.instances[instance.id] = instance;

        return instance;
    }

    destroyInstance (instanceID) {
        const instance = this.instances[instanceID];

        instance.destroy();
    }

    checkStartCriteria (players, dungeonPortal) {
        // Check the party leader has enough glory.
        if(players[0].glory < this.gloryCost) return false;

        // Check all of the party members are next to the portal for this dungeon.
        for(let i=0; i<players.length; i+=1){
            if(players[i].isAdjacentToEntity(dungeonPortal) === false) return false;
        }

        // Reduce the party leaders glory by the entry cost.
        players[0].modGlory(-this.gloryCost);
    }
}

module.exports = DungeonManager;

const Dungeon = require('./Dungeon');
const DungeonManagersList = require('./DungeonManagersList');
const Party = require('./Party');