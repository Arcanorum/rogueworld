
const Mob = require('./Mob');

class Mage extends Mob {}
module.exports = Mage;

Mage.prototype.registerEntityType();
Mage.prototype.assignMobValues("Mage", Mage.prototype);
Mage.prototype.CorpseType = require('../../../corpses/CorpseHuman');
Mage.prototype.dropList = [
    require('./../../../pickups/PickupFabric'),
    require('./../../../pickups/PickupFabric'),
    require('./../../../pickups/PickupFabric'),
    require('./../../../pickups/PickupMageRobe'),
    require('./../../../pickups/PickupFireGem'),
    require('./../../../pickups/PickupFireStaff'),
];