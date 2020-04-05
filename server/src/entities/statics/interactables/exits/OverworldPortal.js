
const Exit = require('./Exit');

class OverworldPortal extends Exit {

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

        // If this portal is in a dungeon, set it as the exit portal when the boss dies.
        // if(DungeonManagersList.ByName[this.board.name] !== undefined){
        //     DungeonManagersList.ByName[this.board.name].overworldPortal = this;
        // }
    }

    /**
     * @param {Player} interactedBy
     * @return {Boolean} Whether this entity was interacted with or not.
     */
    interaction (interactedBy) {
        // Only let them use the portal if it is active.
        if(this.activeState === false) return;

        // Call the Exit interaction.
        super.interaction(interactedBy);
    }

    activate () {
        // Reactivate this portal.
        this.activeState = true;

        // Tell any nearby players that this portal can now be interacted with.
        this.board.emitToNearbyPlayers(this.row, this.col, this.EventsList.active_state, this.row + "-" + this.col);
    }

}
module.exports = OverworldPortal;

const DungeonManagersList = require('../../../../dungeon/DungeonManagersList');

OverworldPortal.prototype.registerEntityType();