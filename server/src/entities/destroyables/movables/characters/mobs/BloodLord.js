
const Boss = require('./Boss');

class BloodLord extends Boss {

    onAttackSuccess() {
        // Vampires heal on attack.
        this.heal(
            new Heal(10)
        );
    }

}
module.exports = BloodLord;

const Heal = require('../../../../../Heal');

BloodLord.prototype.registerEntityType();
BloodLord.prototype.assignMobValues();
BloodLord.prototype.taskIDKilled = require('../../../../../tasks/TaskTypes').KillVampires.taskID;