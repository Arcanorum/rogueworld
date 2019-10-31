
const Mob = require('./Mob');

class Snoovir extends Mob {}
module.exports = Snoovir;

Snoovir.prototype.registerEntityType();
Snoovir.prototype.assignMobValues("Snoovir", Snoovir.prototype);
//Snoovir.prototype.taskIDKilled = require('../../../../../tasks/TaskTypes').KillSnoovirs.taskID; TODO add back
Snoovir.prototype.dropList = [
    require('../../../pickups/PickupOakLogs'),
    require('../../../pickups/PickupFabric'),
    require('../../../pickups/PickupIronOre'),
];