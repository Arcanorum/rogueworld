
const Boss = require('./Boss');

class Commander extends Boss {}
module.exports = Commander;

Commander.prototype.registerEntityType();
Commander.prototype.assignMobValues("Commander", Commander.prototype);
Commander.prototype.CorpseType = require('../../../corpses/CorpseHuman');
Commander.prototype.dropList = [
    require('./../../../pickups/PickupDungiumBar'),
    require('./../../../pickups/PickupDungiumSword'),
    require('./../../../pickups/PickupWindGem'),
    require('./../../../pickups/PickupFireGem'),
    require('./../../../pickups/PickupBookOfLight'),
    require('./../../../pickups/PickupRespawnOrb'),
    require('./../../../pickups/PickupExpOrbMelee'),
];