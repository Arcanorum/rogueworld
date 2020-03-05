
const Bow = require('./Bow');

class ItemFirBow extends Bow {}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemFirBow;

ItemFirBow.prototype.registerItemType();
ItemFirBow.prototype.idName = "Fir bow";
ItemFirBow.prototype.PickupType = require('../../../../entities/destroyables/pickups/PickupFirBow');
ItemFirBow.prototype.iconSource = "icon-fir-bow";
ItemFirBow.prototype.baseValue = 10;
ItemFirBow.prototype.category = Bow.prototype.categories.Weapon;
ItemFirBow.prototype.baseDurability = 200;
ItemFirBow.prototype.useDurabilityCost = 1;
ItemFirBow.prototype.useEnergyCost = 1;
ItemFirBow.prototype.expGivenStatName = ItemFirBow.prototype.StatNames.Ranged;
ItemFirBow.prototype.expGivenOnUse = 10;