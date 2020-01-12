
const Mob = require('./Mob');

class Vampire extends Mob {

    attackMelee () {
        // Only melee attack target if it is adjacent.
        if(this.isAdjacentToEntity(this.target) === false) return;

        // Face the target if not already doing so.
        this.modDirection(this.board.rowColOffsetToDirection(this.target.row - this.row, this.target.col - this.col));

        this.target.damage(this.meleeAttackPower, this);

        // Vampires heal on attack.
        this.modHitPoints(1);
    }

}
module.exports = Vampire;

Vampire.prototype.registerEntityType();
Vampire.prototype.assignMobValues();
Vampire.prototype.taskIDKilled = require('../../../../../tasks/TaskTypes').KillVampires.taskID;