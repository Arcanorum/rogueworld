
const Mob = require('./Mob');

class Goblin extends Mob {}
module.exports = Goblin;

Goblin.prototype.registerEntityType();
Goblin.prototype.assignMobValues("Goblin", Goblin.prototype);
Goblin.prototype.CorpseType = require('../../../corpses/CorpseHuman');
Goblin.prototype.taskIDKilled = require('../../../../../tasks/TaskTypes').KillGoblins.taskID;
Goblin.prototype.dropList = [
    require('../../../pickups/PickupCotton'),
    require('../../../pickups/PickupFabric'),
    require('../../../pickups/PickupIronOre'),
    require('../../../pickups/PickupRedcap'),
    require('../../../pickups/PickupBluecap'),
    require('../../../pickups/PickupGreencap'),
];