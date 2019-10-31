
const Mob = require('./Mob');

class Prisoner extends Mob {}
module.exports = Prisoner;

Prisoner.prototype.registerEntityType();
Prisoner.prototype.assignMobValues("Prisoner", Prisoner.prototype);
Prisoner.prototype.CorpseType = require('../../../corpses/CorpseHuman');
Prisoner.prototype.taskIDKilled = require('../../../../../tasks/TaskTypes').KillOutlaws.taskID;
Prisoner.prototype.dropList = [
    require('../../../pickups/PickupCotton'),
    require('../../../pickups/PickupFabric'),
    require('../../../pickups/PickupIronOre'),
];