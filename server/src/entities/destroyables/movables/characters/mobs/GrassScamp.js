
const Mob = require('./Mob');

class GrassScamp extends Mob {}
module.exports = GrassScamp;

GrassScamp.prototype.registerEntityType();
GrassScamp.prototype.assignMobValues("Grass scamp", GrassScamp.prototype);
//GrassScamp.prototype.CorpseType = require('../../../corpses/CorpseHuman');
GrassScamp.prototype.taskIDKilled = require('../../../../../tasks/TaskTypes').KillScamps.taskID;
GrassScamp.prototype.dropList = [
    require('../../../pickups/PickupCotton'),
    require('../../../pickups/PickupOakLogs'),
    require('../../../pickups/PickupGreencap'),
];