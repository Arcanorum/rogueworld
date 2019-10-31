
const Mob = require('./Mob');

class Mummy extends Mob {}
module.exports = Mummy;

Mummy.prototype.registerEntityType();
Mummy.prototype.assignMobValues("Mummy", Mummy.prototype);
Mummy.prototype.CorpseType = require('../../../corpses/CorpseHuman');
Mummy.prototype.taskIDKilled = require('../../../../../tasks/TaskTypes').KillZombies.taskID;
Mummy.prototype.dropList = [
    require('../../../pickups/PickupOakLogs'),
    require('../../../pickups/PickupCotton'),
    require('../../../pickups/PickupString'),
    require('../../../pickups/PickupFabric'),
    require('../../../pickups/PickupRedcap'),
    require('../../../pickups/PickupGreencap'),
];