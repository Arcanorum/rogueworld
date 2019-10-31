
const Mob = require('./Mob');

class BloodPriest extends Mob {

    onAttackSuccess () {
        this.modHitPoints(-HalfProjBloodBoltDamage);
    }

}
module.exports = BloodPriest;

const HalfProjBloodBoltDamage = require('../../../../../ModHitPointValues').ProjBloodBoltDamage * 0.5;

BloodPriest.prototype.registerEntityType();
BloodPriest.prototype.assignMobValues("Blood priest", BloodPriest.prototype);
BloodPriest.prototype.taskIDKilled = require('../../../../../tasks/TaskTypes').KillVampires.taskID;
BloodPriest.prototype.CorpseType = require('../../../corpses/CorpseHuman');
BloodPriest.prototype.dropList = [
    require('./../../../pickups/PickupFabric'),
    require('./../../../pickups/PickupFabric'),
    require('./../../../pickups/PickupFabric'),
    require('./../../../pickups/PickupNoctisOre'),
    require('./../../../pickups/PickupBloodGem'),
    require('./../../../pickups/PickupNecromancerRobe'),
    require('./../../../pickups/PickupVampireFang'),
    require('./../../../pickups/PickupBloodStaff'),
];