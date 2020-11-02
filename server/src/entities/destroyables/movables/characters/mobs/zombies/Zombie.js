const Mob = require('../Mob');

class Zombie extends Mob {

    claim(master) {
        this.master = master;
        this.faction = master.faction;
    }

    unclaim() {
        this.master = null;
        this.faction = this.Factions.Zombies;
    }

    onMove() {
        // Check this zombie has a master.
        if (this.master !== null) {
            // Check the master is alive.
            if (this.master.hitPoints < 0) {
                this.unclaim();
                return;
            }
            // If no target to attack, then follow the master.
            if (this.target === null) {
                // Check this zombie is within the master's range.
                if (this.isWithinMasterRange() === true) {
                    // Move towards master.
                    this.moveTowardsEntity(this.master);
                    return;
                }
                // Master is too far away. Teleport to master.
                else {
                    // If on the same board, move to master.
                    if (this.master.board === this.board) this.reposition(this.master.row, this.master.col);
                    // On a different board, move to that board.
                    else this.changeBoard(this.board, this.master.board, this.master.row, this.master.col);

                    return;
                }
            }
        }
        // Check if the target is now dead. Might have been killed since the last time this mob moved.

        super.onMove();
    }

    damage(damage, damagedBy) {
        // Ignore damage from master.
        if (damagedBy === this.master) return;

        super.damage(damage, damagedBy);
    }

    isWithinMasterRange() {
        // Horizontal distance.
        if (Math.abs(this.col - this.master.col) > 10) {
            return false;
        }
        // Vertical distance.
        else if (Math.abs(this.row - this.master.row) > 10) {
            return false;
        }
        return true;
    }

    /**
     *
     * @param {Character} character
     * @returns {Boolean}
     */
    isHostileTowardsCharacter(character) {
        // Don't target the master.
        if (this.master === character) return false;

        // Ignore anything that isn't a character.
        if (character instanceof Character === false) return false;

        // Check this mob is hostile towards the other character.
        if (this.Factions.getRelationship(this.faction, character.faction) === this.Factions.RelationshipStatuses.Hostile) return true;

        return false;
    }
}
module.exports = Zombie;

Zombie.abstract = true;

const Character = require('../../Character');

/**
 * The master of this zombie.
 * @type {Player}
 */
Zombie.prototype.master = null;

Zombie.prototype.meleeDamageAmount = 2;
Zombie.prototype.moveRate = 500;
Zombie.prototype.viewRange = 4;
Zombie.prototype.faction = Zombie.prototype.Factions.Zombies;
Zombie.prototype.taskIDKilled = require('../../../../../../tasks/TaskTypes').KillZombies.taskID;