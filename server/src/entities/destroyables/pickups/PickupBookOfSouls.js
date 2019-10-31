
const Pickup = require('./Pickup');

class PickupBookOfSouls extends Pickup {}
// This entity needs to be exported before the item type that it is linked to accesses it.
module.exports = PickupBookOfSouls;

PickupBookOfSouls.prototype.registerEntityType();

PickupBookOfSouls.prototype.ItemType = require('../../../items/holdable/spell_books/ItemBookOfSouls');