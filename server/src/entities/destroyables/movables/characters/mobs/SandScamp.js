
const Mob = require('./Mob');

class SandScamp extends Mob {}
module.exports = SandScamp;

SandScamp.prototype.registerEntityType();
SandScamp.prototype.assignMobValues("Sand scamp", SandScamp.prototype);
//SandScamp.prototype.CorpseType = require('../../../corpses/CorpseHuman');
SandScamp.prototype.taskIDKilled = require('../../../../../tasks/TaskTypes').KillScamps.taskID;
SandScamp.prototype.dropList = [
    require('../../../pickups/PickupDungiumOre'),
    require('../../../pickups/PickupDungiumOre'),
    require('../../../pickups/PickupRedcap'),
    require('../../../pickups/PickupBluecap'),
];