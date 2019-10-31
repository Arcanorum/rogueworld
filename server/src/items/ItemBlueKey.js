
const Item = require('./Item');

class ItemBlueKey extends Item {

    use () {
        this.useGatheringTool();
    }

}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemBlueKey;

ItemBlueKey.prototype.registerItemType();
ItemBlueKey.prototype.idName = "Blue key";
ItemBlueKey.prototype.PickupType = require('../entities/destroyables/pickups/PickupBlueKey');
ItemBlueKey.prototype.baseValue = 10;
ItemBlueKey.prototype.baseDurability = 1;
ItemBlueKey.prototype.category = Item.prototype.categories.BlueKey;
ItemBlueKey.prototype.iconSource = "icon-blue-key";
