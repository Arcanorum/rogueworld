const Mob = require("./Mob");

class BloodPriest extends Mob {
    onAttackSuccess() {
        this.damage(
            new Damage({
                amount: ModHitPointConfigs.ProjBloodBolt.damageAmount * 0.5,
                types: ModHitPointConfigs.ProjBloodBolt.damageTypes,
            }),
        );
    }
}
module.exports = BloodPriest;

const ModHitPointConfigs = require("../../../../../../gameplay/ModHitPointConfigs");
const Damage = require("../../../../../../gameplay/Damage");

BloodPriest.prototype.taskIdKilled = require("../../../../../../tasks/TaskTypes").KillVampires.taskId;
