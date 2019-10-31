
const Pickup = require('./Pickup');

class PickupBookOfLight extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupBookOfLight;

PickupBookOfLight.prototype.registerEntityType();

PickupBookOfLight.prototype.ItemType = require('../../../items/holdable/spell_books/ItemBookOfLight');