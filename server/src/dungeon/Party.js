const Utils = require('../Utils');
const idCounter = new Utils.Counter();

class Party {
    /**
     * @param {Player} player - The player that created this party, who will be the leader.
     */
    constructor(dungeonManager, player) {

        this.id = idCounter.getNext();

        /**
         * @type {Boolean} Whether this party has entered a dungeon yet.
         */
        this.inDungeon = false;

        //this.dungeonManager = dungeonManager;

        /**
         * @type {Array.<Player>} A list of players in this party. [0] is the party leader.
         */
        this.members = [player];

        /**
         * @type {Array.<Number>} A list of player entity IDs of players that have been kicked from this party.
         * @todo Might want to use a player account ID instead of entity ID here otherwise they can refresh the
         * game and will have a different entity ID and can then join the party they were kicked form.
         */
        this.kickedList = [];

        /**
         * @type {Boolean} Whether this party is only for clan members of the leader.
         */
        this.clanOnly = false;
    }

    destroy() {
        //delete this.dungeonManager;
        delete this.members;
        delete this.kickedList;
    }

}

module.exports = Party;