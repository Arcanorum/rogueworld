const Interactable = require('./Interactable');

class DungeonPortal extends Interactable {
    /**
     * @param {Object} config
     * @param {Number} config.row
     * @param {Number} config.col
     * @param {Board} config.board
     * @param {Board} config.dungeonName
     */
    constructor(config) {
        super(config);

        // Link this portal to the dungeon manager.
        /** @type {DungeonManager} A reference to the dungeon instance. */
        this.dungeonManager = DungeonManagersList.ByName["dungeon-" + config.dungeonName];

        if (!this.dungeonManager) {
            Utils.error("Cannot create dungeon portal entity, the target dungeon manager is not in the dungeon managers list. Config:", config);
        }
    }

    /**
     * @param {Player} interactedBy
     * @return {Boolean} Whether this entity was interacted with or not.
     */
    interaction(interactedBy) {
        return true;
    }

    /**
     * Enter a player into this dungeon.
     * @param {Player} player
     */
    enter(player) {
        if (player instanceof Player === false) return;

        this.dungeonManager.start(player, this);
    }

}
module.exports = DungeonPortal;

const Utils = require('../../../Utils');
const Player = require('../../destroyables/movables/characters/Player');
const DungeonManagersList = require('../../../dungeon/DungeonManagersList');

DungeonPortal.prototype.registerEntityType();