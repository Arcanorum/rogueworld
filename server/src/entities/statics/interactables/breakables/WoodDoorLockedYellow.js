
const Breakable = require('./Breakable');

class WoodDoorLockedYellow extends Breakable {

    /**
     * @param {Object} config
     * @param {Number} config.row
     * @param {Number} config.col
     * @param {Board} config.board
     */
    constructor(config) {
        super(config);

        // if(this.board.dungeon === true){
        //     DungeonManagersList.ByName[this.board.name].lockedDoors.push(this);
        //     this.reactivationRate = null;
        // }
    }

    interaction(interactedBy, toolUsed) {
        // Don't do anything to this door if it is not active.
        if (this.activeState === false) return;

        // Don't do anything if no tool was used. Might have been walked into.
        if (toolUsed === undefined) return;

        // Don't do anything to this node if the wrong tool has been used on it.
        if (toolUsed.category !== this.requiredToolCategory) {
            // Tell the player if they are using the wrong tool.
            interactedBy.socket.sendEvent(this.warningEvent);
            return;
        }

        // Reduce the durability of the key used.
        toolUsed.modDurability(-this.interactionDurabilityCost);

        // Check any task progress was made.
        interactedBy.tasks.progressTask(this.taskIDInteracted);

        // The door is now open, so stop it from blocking players.
        this.deactivate();

        this.blocking = false;
    }

    activate() {
        super.activate();
        // If the door was successfully activated (nothing standing on the open door), make it block things.
        if (this.activeState === true) this.blocking = true;
    }

}
module.exports = WoodDoorLockedYellow;

const DungeonManagersList = require('../../../../dungeon/DungeonManagersList');

WoodDoorLockedYellow.prototype.registerEntityType();

WoodDoorLockedYellow.prototype.interactionDurabilityCost = 1;
WoodDoorLockedYellow.prototype.reactivationRate = 10000;
WoodDoorLockedYellow.prototype.requiredToolCategory = require('./../../../../items/Item').prototype.categories.YellowKey;
WoodDoorLockedYellow.prototype.warningEvent = WoodDoorLockedYellow.prototype.EventsList.key_needed;