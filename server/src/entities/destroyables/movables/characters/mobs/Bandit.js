
const Mob = require('./Mob');

class Bandit extends Mob {}
module.exports = Bandit;

Bandit.prototype.registerEntityType();
Bandit.prototype.assignMobValues("Bandit", Bandit.prototype);
Bandit.prototype.CorpseType = require('../../../corpses/CorpseHuman');
Bandit.prototype.taskIDKilled = require('../../../../../tasks/TaskTypes').KillOutlaws.taskID;
Bandit.prototype.dropList = [
    require('../../../pickups/PickupCotton'),
    require('../../../pickups/PickupFabric'),
    require('../../../pickups/PickupIronOre'),
    require('../../../pickups/PickupIronArrows'),
];