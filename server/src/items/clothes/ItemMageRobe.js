
const Clothes = require('./Clothes');

class ItemMageRobe extends Clothes {}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemMageRobe;

const StatNames = require('./../../stats/Statset').prototype.StatNames;

ItemMageRobe.prototype.registerItemType();
ItemMageRobe.prototype.idName = "Mage robe";
ItemMageRobe.prototype.PickupType = require('../../entities/destroyables/pickups/PickupMageRobe');
ItemMageRobe.prototype.iconSource = "icon-mage-robe";
ItemMageRobe.prototype.baseValue = 10;
ItemMageRobe.prototype.category = Clothes.prototype.categories.Clothing;
ItemMageRobe.prototype.baseDurability = 100;
ItemMageRobe.prototype.defenceBonus = 20;
ItemMageRobe.prototype.statBonuses = {
    [StatNames.Magic]: 1
};