
const Item = require('./Item');

class ItemIronPickaxe extends Item {

    use () {
        this.useGatheringTool();
    }

}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemIronPickaxe;

ItemIronPickaxe.prototype.registerItemType();
ItemIronPickaxe.prototype.idName = "Iron pickaxe";
ItemIronPickaxe.prototype.iconSource = "icon-iron-pickaxe";
ItemIronPickaxe.prototype.PickupType = require('../entities/destroyables/pickups/PickupIronPickaxe');
ItemIronPickaxe.prototype.baseValue = 10;
ItemIronPickaxe.prototype.category = Item.prototype.categories.Pickaxe;
ItemIronPickaxe.prototype.baseDurability = 40;