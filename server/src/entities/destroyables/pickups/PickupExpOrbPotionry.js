
const Pickup = require('./Pickup');

class PickupExpOrbPotionry extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupExpOrbPotionry;

PickupExpOrbPotionry.prototype.registerEntityType();
PickupExpOrbPotionry.prototype.ItemType = require('../../../items/ItemExpOrbPotionry');
