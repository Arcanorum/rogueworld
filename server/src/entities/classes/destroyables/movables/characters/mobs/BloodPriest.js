const Mob = require("./Mob");
const Damage = require("../../../../../../gameplay/Damage");
const EntitiesList = require("../../../../../EntitiesList");

class BloodPriest extends Mob {
    onAttackSuccess() {
        // Simulate the self damage of a player using a blood staff item.
        this.damage(
            new Damage({
                amount: EntitiesList.ProjBloodBolt.prototype.damageAmount * 0.5,
                types: EntitiesList.ProjBloodBolt.prototype.damageTypes,
            }),
        );
    }
}
module.exports = BloodPriest;

BloodPriest.prototype.taskIdKilled = require("../../../../../../tasks/TaskTypes").KillVampires.taskId;
