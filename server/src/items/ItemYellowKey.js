
const Item = require('./Item');

class ItemYellowKey extends Item {

    use () {
        this.useGatheringTool();
    }

}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemYellowKey;

ItemYellowKey.prototype.registerItemType();
ItemYellowKey.prototype.idName = "Yellow key";
ItemYellowKey.prototype.PickupType = require('../entities/destroyables/pickups/PickupYellowKey');
ItemYellowKey.prototype.baseValue = 10;
ItemYellowKey.prototype.baseDurability = 1;
ItemYellowKey.prototype.category = Item.prototype.categories.YellowKey;
ItemYellowKey.prototype.iconSource = "icon-yellow-key";
