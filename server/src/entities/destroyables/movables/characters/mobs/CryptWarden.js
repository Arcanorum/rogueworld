
const Mob = require('./Mob');

class CryptWarden extends Mob {}
module.exports = CryptWarden;

CryptWarden.prototype.registerEntityType();
CryptWarden.prototype.assignMobValues("Crypt warden", CryptWarden.prototype);
CryptWarden.prototype.CorpseType = require('../../../corpses/CorpseHuman');
CryptWarden.prototype.taskIDKilled = require('../../../../../tasks/TaskTypes').KillZombies.taskID;
CryptWarden.prototype.dropList = [
    require('./../../../pickups/PickupIronBar'),
    require('./../../../pickups/PickupIronSheet'),
    require('./../../../pickups/PickupIronSword'),
    require('./../../../pickups/PickupDungiumBar'),
    require('./../../../pickups/PickupFabric'),
];