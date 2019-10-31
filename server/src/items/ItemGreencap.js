
const Item = require('./Item');

class ItemGreencap extends Item {

    onUsed () {
        this.owner.modHitPoints(-1);

        super.onUsed();
    }

}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemGreencap;

ItemGreencap.prototype.registerItemType();
ItemGreencap.prototype.idName = "Greencap";
ItemGreencap.prototype.PickupType = require('../entities/destroyables/pickups/PickupGreencap');
ItemGreencap.prototype.baseValue = 10;
ItemGreencap.prototype.craftingExpValue = 10;
ItemGreencap.prototype.iconSource = "icon-greencap";
ItemGreencap.prototype.expGivenStatName = ItemGreencap.prototype.StatNames.Potionry;
ItemGreencap.prototype.expGivenOnUse = 5;
ItemGreencap.prototype.baseDurability = 1;
ItemGreencap.prototype.useDurabilityCost = 1;