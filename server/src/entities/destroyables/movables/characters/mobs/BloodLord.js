
const Boss = require('./Boss');

class BloodLord extends Boss {

    onAttackSuccess() {
        // Vampires heal on attack.
        this.modHitPoints(10);
    }

}
module.exports = BloodLord;

BloodLord.prototype.registerEntityType();
BloodLord.prototype.assignMobValues();
BloodLord.prototype.taskIDKilled = require('../../../../../tasks/TaskTypes').KillVampires.taskID;