const Utils = require('../Utils');
const idCounter = new Utils.Counter();

class Party {
    /**
     * @param {Player} player - The player that created this party, who will be the leader.
     */
    constructor (dungeonManager, player) {

        this.id = idCounter.getNext();

        this.dungeonManager = dungeonManager;
        
        /**
         * @type {Array.<Player>} A list of players in this party. [0] is the party leader.
         */
        this.members = [player];

        /**
         * @type {Array.<Number>} A list of player entity IDs of players that have been kicked from this party.
         */
        this.kickedList = [];

        /**
         * @type {Boolean} Whether this party is only for clan members of the leader.
         */
        this.clanOnly = false;
    }

    addPlayer (player) {
        if(this.kickedList.includes(player.id)) return;

        if(this.clanOnly){
            // Check they are in the same clan as the party leader.
            // TODO: when clans are added
            //if(player.clan.id !== this.members[0].clan.id) return;
        }

        this.members.push(player);
    }

    removePlayer (player) {
        // If the player to remove is the leader, disband the party.
        if(player === this.members[0]){
            // Tell all members that the party has been disbanded.
            // TODO

            // Tell the dungeon manager to remove this party.
            this.dungeonManager.removeParty(this);

            this.members = [];
        }
        else {
            this.members = this.members.filter((member) => member === player);
        }
    }

    kickPlayer (kickedBy, player) {
        // Only allow the party leader to kick.
        if(kickedBy !== this.members[0]) return;

        this.removePlayer(player);

        // Add them to the kicked list so they can't rejoin.
        this.kickedList.push(player.id);
    }
}

module.exports = Party;