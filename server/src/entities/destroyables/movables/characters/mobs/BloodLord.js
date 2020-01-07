
const Boss = require('./Boss');

class BloodLord extends Boss {

    onAttackSuccess() {
        // Vampires heal on attack.
        this.modHitPoints(10);
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