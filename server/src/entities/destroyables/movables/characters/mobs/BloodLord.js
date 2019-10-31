
const Boss = require('./Boss');

class BloodLord extends Boss {

    attackMelee () {
        // Only melee attack target if it is adjacent.
        if(this.isAdjacentToEntity(this.target) === false) return;

        // Face the target if not already doing so.
        this.modDirection(this.board.rowColOffsetToDirection(this.target.row - this.row, this.target.col - this.col));

        this.target.damage(this.meleeAttackPower, this);

        // Vampires heal on attack.
        this.modHitPoints(2);
    }

}
module.exports = BloodLord;

BloodLord.prototype.registerEntityType();
BloodLord.prototype.assignMobValues("Blood lord", BloodLord.prototype);
BloodLord.prototype.taskIDKilled = require('../../../../../tasks/TaskTypes').KillVampires.taskID;
BloodLord.prototype.CorpseType = require('../../../corpses/CorpseHuman');
BloodLord.prototype.dropList = [
    require('../../../pickups/PickupBookOfSouls'),
    require('../../../pickups/PickupFireGem'),
    require('../../../pickups/PickupBloodGem'),
    require('../../../pickups/PickupExpOrbMelee'),
    require('../../../pickups/PickupExpOrbMagic'),
    require('../../../pickups/PickupVampireFang'),
    require('../../../pickups/PickupNoctisArmour'),
];