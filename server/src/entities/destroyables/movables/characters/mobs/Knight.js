
const Mob = require('./Mob');

class Knight extends Mob {}
module.exports = Knight;

Knight.prototype.registerEntityType();
Knight.prototype.assignMobValues("Knight", Knight.prototype);
Knight.prototype.CorpseType = require('../../../corpses/CorpseHuman');
Knight.prototype.dropList = [
    require('./../../../pickups/PickupRedcap'),
    require('./../../../pickups/PickupIronBar'),
    require('./../../../pickups/PickupIronBar'),
    require('./../../../pickups/PickupIronBar'),
    require('./../../../pickups/PickupIronSword'),
    require('./../../../pickups/PickupDungiumSheet'),
];