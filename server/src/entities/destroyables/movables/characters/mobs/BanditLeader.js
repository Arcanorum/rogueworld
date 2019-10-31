
const Boss = require('./Boss');

class BanditLeader extends Boss {}
module.exports = BanditLeader;

BanditLeader.prototype.registerEntityType();
BanditLeader.prototype.assignMobValues("Bandit leader", BanditLeader.prototype);
BanditLeader.prototype.CorpseType = require('../../../corpses/CorpseHuman');
BanditLeader.prototype.taskIDKilled = require('../../../../../tasks/TaskTypes').KillOutlaws.taskID;
BanditLeader.prototype.dropList = [
    require('../../../pickups/PickupFireGem'),
    require('../../../pickups/PickupWindGem'),
    require('../../../pickups/PickupDungiumBar'),
    require('../../../pickups/PickupDungiumBar'),
    require('../../../pickups/PickupDungiumSword'),
    require('../../../pickups/PickupCloak'),
    require('../../../pickups/PickupNinjaGarb'),
    require('../../../pickups/PickupExpOrbMelee'),
];