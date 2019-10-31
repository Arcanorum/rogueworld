
const Exit = require('./Exit');

class DungeonPortal extends Exit {

    /**
     * @param {Object} config
     * @param {Number} config.row
     * @param {Number} config.col
     * @param {Board} config.board
     * @param {Board} config.targetBoard
     * @param {String} config.targetEntranceName
     */
    constructor (config) {
        super(config);

        // Link this portal to the dungeon.
        /** @type {Dungeon} A reference to the dungeon instance. */
        this.dungeon = DungeonsList.ByName[config.targetBoard];
        this.dungeon.dungeonPortal = this;
    }

    /**
     * @param {Player} interactedBy
     * @return {Boolean} Whether this entity was interacted with or not.
     */
    interaction (interactedBy) {
        return true;
    }

    /**
     * Enter a player into this dungeon.
     * @param {Player} player
     */
    enter (player) {
        // Check they are adjacent to the door. Might have moved away from it since being shown the dungeon prompt.
        if(this.isAdjacentToEntity(player) === false) return false;
        // Check they have enough glory.
        if(player.glory < this.dungeon.gloryCost) return false;
        // Check the dungeon is active. The boss might be dead.
        if(this.activeState === false) return false;
        // Move them to the dungeon board.
        super.interaction(player);
        // Reduce their glory by the entry cost.
        player.modGlory(-this.dungeon.gloryCost);
    }

}
module.exports = DungeonPortal;

const Player = require('../../../destroyables/movables/characters/Player');
const DungeonsList = require('../../../../DungeonsList');

DungeonPortal.prototype.registerEntityType();