
const Bow = require('./Bow');

class ItemOakBow extends Bow {}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemOakBow;

ItemOakBow.prototype.registerItemType();
ItemOakBow.prototype.idName = "Oak bow";
ItemOakBow.prototype.PickupType = require('../../../../entities/destroyables/pickups/PickupOakBow');
ItemOakBow.prototype.iconSource = "icon-oak-bow";
ItemOakBow.prototype.baseValue = 10;
ItemOakBow.prototype.category = Bow.prototype.categories.Weapon;
ItemOakBow.prototype.baseDurability = 200;
ItemOakBow.prototype.useDurabilityCost = 1;
ItemOakBow.prototype.useEnergyCost = 1;
ItemOakBow.prototype.expGivenStatName = ItemOakBow.prototype.StatNames.Ranged;
ItemOakBow.prototype.expGivenOnUse = 10;