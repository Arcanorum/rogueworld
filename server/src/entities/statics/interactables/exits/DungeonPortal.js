const Interactable = require('../Interactable');

class DungeonPortal extends Interactable {
    /**
     * @param {Object} config
     * @param {Number} config.row
     * @param {Number} config.col
     * @param {Board} config.board
     * @param {Board} config.dungeonName
     */
    constructor (config) {
        super(config);
        
        // Link this portal to the dungeon manager.
        /** @type {dungeonManager} A reference to the dungeon instance. */
        this.dungeonManager = DungeonManagersList.ByName["dungeon-" + config.dungeonName];

        if(!this.dungeonManager){
            Utils.error("Cannot create dungeon portal entity, the target dungeon manager is not in the dungeon managers list. Config:", config);
        }
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
        if(interactedBy instanceof Player === false) return;

        // Check they are adjacent to the door. Might have moved away from it since being shown the dungeon prompt.
        if(this.isAdjacentToEntity(player) === false) return false;        
    }

}
module.exports = DungeonPortal;

const Utils = require('../../../../Utils');
const Player = require('../../../destroyables/movables/characters/Player');
const DungeonManagersList = require('../../../../dungeon/DungeonManagersList');

DungeonPortal.prototype.registerEntityType();