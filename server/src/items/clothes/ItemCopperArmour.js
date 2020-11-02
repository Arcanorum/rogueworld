
const Clothes = require('./Clothes');

class ItemCopperArmour extends Clothes {}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemCopperArmour;

const StatNames = require('./../../stats/Statset').prototype.StatNames;

ItemCopperArmour.prototype.registerItemType();
ItemCopperArmour.prototype.idName = "Copper armour";
ItemCopperArmour.prototype.PickupType = require('../../entities/destroyables/pickups/PickupCopperArmour');
ItemCopperArmour.prototype.iconSource = "icon-copper-armour";
ItemCopperArmour.prototype.baseValue = 10;
ItemCopperArmour.prototype.category = Clothes.prototype.categories.Clothing;
ItemCopperArmour.prototype.baseDurability = 100;
ItemCopperArmour.prototype.defenceBonus = 40;
ItemCopperArmour.prototype.statBonuses = {
    [StatNames.Melee]: 1
};