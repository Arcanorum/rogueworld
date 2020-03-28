
const Clothes = require('./Clothes');

class ItemIronArmour extends Clothes {}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemIronArmour;

const StatNames = require('./../../stats/Statset').prototype.StatNames;

ItemIronArmour.prototype.registerItemType();
ItemIronArmour.prototype.idName = "Iron armour";
ItemIronArmour.prototype.PickupType = require('../../entities/destroyables/pickups/PickupIronArmour');
ItemIronArmour.prototype.iconSource = "icon-iron-armour";
ItemIronArmour.prototype.baseValue = 10;
ItemIronArmour.prototype.category = Clothes.prototype.categories.Clothing;
ItemIronArmour.prototype.baseDurability = 100;
ItemIronArmour.prototype.defenceBonus = 50;
ItemIronArmour.prototype.statBonuses = {
    [StatNames.Melee]: 1
};