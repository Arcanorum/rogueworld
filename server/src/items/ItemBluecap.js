
const Item = require('./Item');

class ItemBluecap extends Item {

    onUsed () {
        this.owner.modEnergy(1);

        super.onUsed();
    }

}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemBluecap;

ItemBluecap.prototype.registerItemType();
ItemBluecap.prototype.idName = "Bluecap";
ItemBluecap.prototype.PickupType = require('../entities/destroyables/pickups/PickupBluecap');
ItemBluecap.prototype.baseValue = 10;
ItemBluecap.prototype.craftingExpValue = 10;
ItemBluecap.prototype.iconSource = "icon-bluecap";
ItemBluecap.prototype.expGivenStatName = ItemBluecap.prototype.StatNames.Potionry;
ItemBluecap.prototype.expGivenOnUse = 5;
ItemBluecap.prototype.baseDurability = 1;
ItemBluecap.prototype.useDurabilityCost = 1;