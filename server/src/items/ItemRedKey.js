
const Item = require('./Item');

class ItemRedKey extends Item {

    use () {
        this.useGatheringTool();
    }

}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemRedKey;

ItemRedKey.prototype.registerItemType();
ItemRedKey.prototype.idName = "Red key";
ItemRedKey.prototype.PickupType = require('../entities/destroyables/pickups/PickupRedKey');
ItemRedKey.prototype.baseValue = 10;
ItemRedKey.prototype.baseDurability = 1;
ItemRedKey.prototype.category = Item.prototype.categories.RedKey;
ItemRedKey.prototype.iconSource = "icon-red-key";
