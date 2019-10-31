
const Clothes = require('./Clothes');

class ItemNoctisArmour extends Clothes {}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemNoctisArmour;

const StatNames = require('./../../stats/Statset').prototype.StatNames;

ItemNoctisArmour.prototype.registerItemType();
ItemNoctisArmour.prototype.idName = "Noctis armour";
ItemNoctisArmour.prototype.PickupType = require('../../entities/destroyables/pickups/PickupNoctisArmour');
ItemNoctisArmour.prototype.iconSource = "icon-noctis-armour";
ItemNoctisArmour.prototype.baseValue = 10;
ItemNoctisArmour.prototype.category = Clothes.prototype.categories.Clothing;
ItemNoctisArmour.prototype.baseDurability = 150;
ItemNoctisArmour.prototype.defenceBonus = 0.4;
ItemNoctisArmour.prototype.statBonuses = {
    [StatNames.Melee]: 5
};