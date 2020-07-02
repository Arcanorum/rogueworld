
const Mob = require('./Mob');

class BloodPriest extends Mob {

    onAttackSuccess() {
        this.damage(
            new Damage({
                amount: ModHitPointConfigs.ProjBloodBolt.damageAmount * 0.5,
                types: ModHitPointConfigs.ProjBloodBolt.damageTypes
            })
        );
    }

}
module.exports = BloodPriest;

const ModHitPointConfigs = require('../../../../../gameplay/ModHitPointConfigs');
const Damage = require('../../../../../gameplay/Damage');

BloodPriest.prototype.registerEntityType();
BloodPriest.prototype.assignMobValues();
BloodPriest.prototype.taskIDKilled = require('../../../../../tasks/TaskTypes').KillVampires.taskID;