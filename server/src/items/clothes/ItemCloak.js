
const Clothes = require('./Clothes');

class ItemCloak extends Clothes {}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemCloak;

const StatNames = require('./../../stats/Statset').prototype.StatNames;

ItemCloak.prototype.registerItemType();
ItemCloak.prototype.idName = "Cloak";
ItemCloak.prototype.PickupType = require('../../entities/destroyables/pickups/PickupCloak');
ItemCloak.prototype.iconSource = "icon-cloak";
ItemCloak.prototype.baseValue = 10;
ItemCloak.prototype.category = Clothes.prototype.categories.Clothing;
ItemCloak.prototype.baseDurability = 100;
ItemCloak.prototype.defenceBonus = 0.3;
ItemCloak.prototype.statBonuses = {
    [StatNames.Ranged]: 1
};