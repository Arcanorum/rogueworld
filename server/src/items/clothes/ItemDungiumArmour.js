
const Clothes = require('./Clothes');

class ItemDungiumArmour extends Clothes {}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemDungiumArmour;

const StatNames = require('./../../stats/Statset').prototype.StatNames;

ItemDungiumArmour.prototype.registerItemType();
ItemDungiumArmour.prototype.idName = "Dungium armour";
ItemDungiumArmour.prototype.PickupType = require('../../entities/destroyables/pickups/PickupDungiumArmour');
ItemDungiumArmour.prototype.iconSource = "icon-dungium-armour";
ItemDungiumArmour.prototype.baseValue = 10;
ItemDungiumArmour.prototype.category = Clothes.prototype.categories.Clothing;
ItemDungiumArmour.prototype.baseDurability = 200;
ItemDungiumArmour.prototype.defenceBonus = 0.35;
ItemDungiumArmour.prototype.statBonuses = {
    [StatNames.Melee]: 2
};