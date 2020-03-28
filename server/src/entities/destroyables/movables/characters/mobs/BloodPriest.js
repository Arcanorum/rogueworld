
const Mob = require('./Mob');

class BloodPriest extends Mob {

    onAttackSuccess () {
        // Heal when an attack hits (a blood bolt).
        this.heal(
            new Heal(HalfProjBloodBoltDamage)
        );
    }

}
module.exports = BloodPriest;

const HalfProjBloodBoltDamage = require('../../../../../gameplay/ModHitPointConfigs').ProjBloodBolt.damageAmount * 0.5;
const Heal = require('../../../../../gameplay/Heal');

BloodPriest.prototype.registerEntityType();
BloodPriest.prototype.assignMobValues();
BloodPriest.prototype.taskIDKilled = require('../../../../../tasks/TaskTypes').KillVampires.taskID;