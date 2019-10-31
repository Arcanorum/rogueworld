
const Item = require('./Item');

class ItemGreenKey extends Item {

    use () {
        this.useGatheringTool();
    }

}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemGreenKey;

ItemGreenKey.prototype.registerItemType();
ItemGreenKey.prototype.idName = "Green key";
ItemGreenKey.prototype.PickupType = require('../entities/destroyables/pickups/PickupGreenKey');
ItemGreenKey.prototype.baseValue = 10;
ItemGreenKey.prototype.baseDurability = 1;
ItemGreenKey.prototype.category = Item.prototype.categories.GreenKey;
ItemGreenKey.prototype.iconSource = "icon-green-key";
