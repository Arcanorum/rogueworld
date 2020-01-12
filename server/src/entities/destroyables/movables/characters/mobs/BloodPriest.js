
const Mob = require('./Mob');

class BloodPriest extends Mob {

    onAttackSuccess () {
        this.modHitPoints(-HalfProjBloodBoltDamage);
    }

}
module.exports = BloodPriest;

const HalfProjBloodBoltDamage = require('../../../../../ModHitPointValues').ProjBloodBoltDamage * 0.5;

BloodPriest.prototype.registerEntityType();
BloodPriest.prototype.assignMobValues();
BloodPriest.prototype.taskIDKilled = require('../../../../../tasks/TaskTypes').KillVampires.taskID;