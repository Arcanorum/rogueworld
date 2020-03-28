
const Clothes = require('./Clothes');

class ItemPlainRobe extends Clothes {}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemPlainRobe;

const StatNames = require('./../../stats/Statset').prototype.StatNames;

ItemPlainRobe.prototype.registerItemType();
ItemPlainRobe.prototype.idName = "Plain robe";
ItemPlainRobe.prototype.PickupType = require('../../entities/destroyables/pickups/PickupPlainRobe');
ItemPlainRobe.prototype.iconSource = "icon-plain-robe";
ItemPlainRobe.prototype.baseValue = 10;
ItemPlainRobe.prototype.category = Clothes.prototype.categories.Clothing;
ItemPlainRobe.prototype.baseDurability = 100;
ItemPlainRobe.prototype.defenceBonus = 20;
ItemPlainRobe.prototype.statBonuses = {
    [StatNames.Potionry]: 1
};