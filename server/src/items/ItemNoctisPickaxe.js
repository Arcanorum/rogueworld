
const Item = require('./Item');

class ItemNoctisPickaxe extends Item {

    use () {
        this.useGatheringTool();
    }

}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemNoctisPickaxe;

ItemNoctisPickaxe.prototype.registerItemType();
ItemNoctisPickaxe.prototype.idName = "Noctis pickaxe";
ItemNoctisPickaxe.prototype.iconSource = "icon-noctis-pickaxe";
ItemNoctisPickaxe.prototype.PickupType = require('../entities/destroyables/pickups/PickupNoctisPickaxe');
ItemNoctisPickaxe.prototype.baseValue = 10;
ItemNoctisPickaxe.prototype.category = Item.prototype.categories.Pickaxe;
ItemNoctisPickaxe.prototype.baseDurability = 40;
ItemNoctisPickaxe.prototype.expGivenStatName = ItemNoctisPickaxe.prototype.StatNames.Gathering;
ItemNoctisPickaxe.prototype.expGivenOnUse = 10;