
const Boss = require('./Boss');

class Pharaoh extends Boss {}
module.exports = Pharaoh;

Pharaoh.prototype.registerEntityType();
Pharaoh.prototype.assignMobValues("Pharaoh", Pharaoh.prototype);
Pharaoh.prototype.CorpseType = require('../../../corpses/CorpseHuman');
Pharaoh.prototype.taskIDKilled = require('../../../../../tasks/TaskTypes').KillZombies.taskID;
Pharaoh.prototype.dropList = [
    require('../../../pickups/PickupDungiumBar'),
    require('../../../pickups/PickupFireGem'),
    require('../../../pickups/PickupWindGem'),
    require('../../../pickups/PickupSuperFireStaff'),
    require('../../../pickups/PickupFireStaff'),
    require('../../../pickups/PickupExpOrbMagic'),
    require('../../../pickups/PickupNecromancerRobe'),
    require('../../../pickups/PickupBookOfSouls'),
];