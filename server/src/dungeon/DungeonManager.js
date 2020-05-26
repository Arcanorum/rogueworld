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
     * @param {Number} [config.timeLimitMinutes=30] - How many minutes the players have to leave the dungeon before they are evicted.
     * @param {String} [config.difficultyName=Difficulties.Beginner] - Roughly how difficult this dungeon is relative to most others.
     * @param {String} [config.evictionMapName] - The name of the map/board the players will be evicted to.
     * @param {String} [config.evictionEntranceName] - The name of the entrance the players will be evicted to.
     */
    constructor(config) {
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
        this.timeLimitMinutes = config.timeLimitMinutes || 0.1;//30;
        this.difficultyName = config.difficultyName || "";

        /**
         * The list of active dungeon instances that this manager is responsible for, by their ID.
         * @type {Object.<Dungeon>}
         */
        this.instances = {};

        /**
         * The list of parties that are waiting to start this dungeon, by their ID.
         * @type {Object.<Party>}
         */
        this.parties = {};

        // Easy to access references to this instance.
        DungeonManagersList.ByID[this.id] = this;
        DungeonManagersList.ByName[this.name] = this;

        let difficulty = Difficulties.Beginner;
        // Use the given difficulty name map setting if given.
        if (config.difficultyName) {
            difficulty = Difficulties[config.difficultyName];
            // Check the given difficulty name is valid.
            if (!difficulty) Utils.error(
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

        this.evictionBoard = config.evictionMapName || "overworld";
        this.evictionEntrance = config.evictionEntranceName || "city-spawn";

        /**
         * How much glory a player must pay to enter.
         * Written to client to show the glory cost on the dungeon prompt.
         * @type {Number}
         */
        this.gloryCost = difficulty.gloryCost || 0;
    }

    /**
     * Creates a new party for this dungeon.
     * @param {Player} player - The player to be the party leader/owner.
     */
    createParty(player) {
        if (!player) return;
        const party = new Party(this, player);
        this.parties[party.id] = party;
    }

    /**
     * Remove/destroy a party from this dungeon manager.
     * @param {Party} party 
     */
    removeParty(party) {
        if (party.inDungeon === false) {
            party.destroy();
        }
        delete this.parties[party.id];
    }

    /**
     * Add a player to an existing party.
     * @param {Player} player 
     * @param {Number} partyID 
     */
    addPlayerToParty(player, partyID) {
        if (!player) return;
        const party = this.parties[partyID];
        if (!party) return;

        // Don't add them if they have previously been kicked.
        if (party.kickedList.includes(player.id)) return;

        // Don't add them if they are already in the party.
        if (party.members.some((member) => member === player)) return;

        if (party.clanOnly) {
            // Check they are in the same clan as the party leader.
            // TODO: when clans are added
            //if(player.clan.id !== this.members[0].clan.id) return;
        }

        party.members.push(player);

        const partiesData = this.getPartiesData();
        // Update the party data of all of the party members, so they see the new member.
        // Includes the new member themself.
        party.members.forEach((member) => {
            member.socket.sendEvent(EventsList.parties, partiesData);
        });
    }

    /**
     * Remove a player from the party they are in.
     * @param {Player} player 
     */
    removePlayerFromParty(player) {
        // Find the party the player is in.
        const party = Object.values(this.parties).find((party) => {
            return party.members.some((member) => member === player);
        });
        // Not in a party.
        if (!party) return;

        if (party.inDungeon) {
            // The dungeon has already started, so just remove that player, don't disband the party.
            party.members = party.members.filter((member) => member !== player);

            if (party.members.length > 0) {
                // Tell the other party members that someone has left.
                // party.members.forEach((member) => {
                //     member.socket.sendEvent(EventsList.member_left, player.id);
                // });
            }
            // No players left in the party, and therefore the dungeon is empty. Destroy them both.
            else {
                this.removeParty(party);
                //TODO: destroy dungeon instance the party is in
            }
        }
        // Not yet in a dungeon, still waiting outside.
        else {
            // If the player to remove is the leader, disband the party.
            if (player === party.members[0]) {
                // TODO: Tell all members that the party has been disbanded.

                // Tell the dungeon manager to remove this party.
                this.removeParty(party);

                party.members = [];
            }
            // Not the leader, just remove the member that left.
            else {
                party.members = party.members.filter((member) => member !== player);

                const partiesData = this.getPartiesData();
                // Update the party data of all of the party members, so they remove the member.
                party.members.forEach((member) => {
                    member.socket.sendEvent(EventsList.parties, partiesData);
                });
            }
        }
    }

    /**
     * Gets a list of parties (who are not yet in a dungeon
     * instance) that this dungeon manager is managing.
     * @returns {Array}
     */
    getPartiesData() {
        return Object
            .values(this.parties)
            .filter((party) => {
                // Ignore parties that are in a dungeon already.
                return party.inDungeon === false;
            })
            .map((party) => {
                return {
                    // Client needs the party ID to join a party.
                    id: party.id,
                    members: party.members.map((member) => {
                        return {
                            // Client needs the player ID so they can be identified
                            // if they are kicked, as display names are not unique.
                            id: member.id,
                            displayName: member.displayName
                        }
                    }),
                    clanOnly: party.clanOnly
                }
            });
    }

    /**
     * Attempt to start a dungeon instance for a party of players.
     * @param {Array.<Player>} leader - A list of player entities.
     * @param {dungeonPortal} dungeonPortal - The dungeon portal entity that this start was initiated from.
     */
    start(leader, dungeonPortal) {
        // Find the party the given party leader is in.
        const party = Object.values(this.parties).find((party) => {
            return party.members[0] === leader;
        });
        if (!party) return;

        if (this.checkStartCriteria(party, dungeonPortal) === false) return;

        this.createInstance(party);

        party.inDungeon = true;
    }

    /**
     * Create a new dungeon and corresponding board instance.
     */
    createInstance(party) {
        // Create a dungeon instance, and give it the map data to make it's own board.
        const instance = new Dungeon({
            party,
            dungeonManager: this,
            name: this.boardConfig.name,
            mapData: this.boardConfig.mapData,
            alwaysNight: this.boardConfig.alwaysNight,
            timeLimitMinutes: this.timeLimitMinutes,
            evictionBoard: this.evictionBoard,
            evictionEntrance: this.evictionEntrance
        });

        this.instances[instance.id] = instance;
    }

    /**
     * Destroy a dungeon instance that belongs to this dungeon manager.
     * @param {Number} instanceID 
     */
    destroyInstance(instanceID) {
        const instance = this.instances[instanceID];

        instance.destroy();
    }

    /**
     * 
     * @param {Party} party 
     * @param {DungeonPortal} dungeonPortal 
     */
    checkStartCriteria(party, dungeonPortal) {
        if (!dungeonPortal) {
            Utils.error("Checking dungeon start criteria, no dungeon portal instance given.");
            return false;
        }

        const members = party.members;

        // Don't allow more than the max players.
        if (members.length > this.maxPlayers) {
            Utils.error("Players list is larger than the max players for this dungeon.");
        }

        // Check the party leader has enough glory.
        //if (members[0].glory < this.gloryCost) return false;

        // TODO check all of the members are in the same clan

        // Check all of the party members are next to the portal for this dungeon.
        for (let i = 0; i < members.length; i += 1) {
            if (members[i].isAdjacentToEntity(dungeonPortal) === false) return false;
        }

        // Reduce the party leaders glory by the entry cost.
        //members[0].modGlory(-this.gloryCost);
    }
}

module.exports = DungeonManager;

const Dungeon = require('./Dungeon');
const DungeonManagersList = require('./DungeonManagersList');
const Party = require('./Party');
const EventsList = require('../EventsList');
const BoardsList = require('../board/BoardsList');