const Boss = require("./Boss");

class BloodLord extends Boss {
    onAttackSuccess() {
        // Vampires heal on attack.
        this.heal(
            new Heal(10),
        );
    }
}
module.exports = BloodLord;

const Heal = require("../../../../../gameplay/Heal");

BloodLord.prototype.taskIdKilled = require("../../../../../tasks/TaskTypes").KillVampires.taskId;
