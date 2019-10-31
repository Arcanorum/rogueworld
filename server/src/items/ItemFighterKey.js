
const Item = require('./Item');

class ItemFighterKey extends Item {

    use () {
        this.useGatheringTool();
    }

}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemFighterKey;

ItemFighterKey.prototype.registerItemType();
ItemFighterKey.prototype.idName = "Fighter key";
ItemFighterKey.prototype.PickupType = require('../entities/destroyables/pickups/PickupFighterKey');
ItemFighterKey.prototype.baseValue = 10;
ItemFighterKey.prototype.baseDurability = 1;
ItemFighterKey.prototype.category = Item.prototype.categories.FighterKey;
ItemFighterKey.prototype.iconSource = "icon-fighter-key";
