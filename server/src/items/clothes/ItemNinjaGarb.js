
const Clothes = require('./Clothes');

class ItemNinjaGarb extends Clothes {}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemNinjaGarb;

const StatNames = require('./../../stats/Statset').prototype.StatNames;

ItemNinjaGarb.prototype.registerItemType();
ItemNinjaGarb.prototype.idName = "Ninja garb";
ItemNinjaGarb.prototype.PickupType = require('../../entities/destroyables/pickups/PickupNinjaGarb');
ItemNinjaGarb.prototype.iconSource = "icon-ninja-garb";
ItemNinjaGarb.prototype.baseValue = 10;
ItemNinjaGarb.prototype.category = Clothes.prototype.categories.Clothing;
ItemNinjaGarb.prototype.baseDurability = 100;
ItemNinjaGarb.prototype.defenceBonus = 30;
ItemNinjaGarb.prototype.statBonuses = {
    [StatNames.Melee]: 1,
    [StatNames.Ranged]: 1,
};