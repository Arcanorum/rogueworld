
const Pickup = require('./Pickup');

class PickupArmourOfIre extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupArmourOfIre;

PickupArmourOfIre.prototype.registerEntityType();
PickupArmourOfIre.prototype.ItemType = require('../../../items/clothes/ItemArmourOfIre');
