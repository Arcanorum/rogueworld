
const Clothes = require('./Clothes');

class ItemNecromancerRobe extends Clothes {}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemNecromancerRobe;

const StatNames = require('./../../stats/Statset').prototype.StatNames;

ItemNecromancerRobe.prototype.registerItemType();
ItemNecromancerRobe.prototype.idName = "Necromancer robe";
ItemNecromancerRobe.prototype.PickupType = require('../../entities/destroyables/pickups/PickupNecromancerRobe');
ItemNecromancerRobe.prototype.iconSource = "icon-necromancer-robe";
ItemNecromancerRobe.prototype.baseValue = 10;
ItemNecromancerRobe.prototype.category = Clothes.prototype.categories.Clothing;
ItemNecromancerRobe.prototype.baseDurability = 100;
ItemNecromancerRobe.prototype.defenceBonus = 20;
ItemNecromancerRobe.prototype.statBonuses = {
    [StatNames.Magic]: 1
};