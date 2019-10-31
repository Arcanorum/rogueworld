
const Item = require('./Item');

class ItemPitKey extends Item {

    use () {
        this.useGatheringTool();
    }

}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemPitKey;

ItemPitKey.prototype.registerItemType();
ItemPitKey.prototype.idName = "Pit key";
ItemPitKey.prototype.PickupType = require('../entities/destroyables/pickups/PickupPitKey');
ItemPitKey.prototype.baseValue = 10;
ItemPitKey.prototype.baseDurability = 1;
ItemPitKey.prototype.category = Item.prototype.categories.PitKey;
ItemPitKey.prototype.iconSource = "icon-pit-key";
