const Breakable = require("./Breakable");

class WoodDoorLockedRed extends Breakable {
    interaction(interactedBy) {
        // Don't do anything to this door if it is not active.
        if (this.activeState === false) return;

        // Check they are a player. Only players can use the keys to open locked doors.
        if (interactedBy.socket && this.board.dungeon) {
            if (this.board.dungeon.doorKeys.red > 0) {
                this.board.dungeon.doorKeys.red -= 1;
                this.board.dungeon.emitDoorKeysToParty();

                // The door is now open, so stop it from blocking players.
                this.deactivate();

                this.blocking = false;
            }
            else {
                // Tell the player they need a key that matches this door.
                interactedBy.socket.sendEvent(this.warningEvent);
            }
        }
    }

    activate() {
        super.activate();
        // If the door was successfully activated (nothing standing on the open door), make it block things.
        if (this.activeState === true) this.blocking = true;
    }
}
module.exports = WoodDoorLockedRed;

WoodDoorLockedRed.prototype.warningEvent = WoodDoorLockedRed.prototype.EventsList.key_needed;
