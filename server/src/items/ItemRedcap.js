
const Item = require('./Item');

class ItemRedcap extends Item {

    onUsed() {
        this.owner.heal(
            new Heal(5)
        );

        super.onUsed();
    }

}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemRedcap;

const Heal = require('../gameplay/Heal');

ItemRedcap.prototype.registerItemType();
ItemRedcap.prototype.idName = "Redcap";
ItemRedcap.prototype.PickupType = require('../entities/destroyables/pickups/PickupRedcap');
ItemRedcap.prototype.baseValue = 10;
ItemRedcap.prototype.craftingExpValue = 10;
ItemRedcap.prototype.iconSource = "icon-redcap";
ItemRedcap.prototype.expGivenStatName = ItemRedcap.prototype.StatNames.Potionry;
ItemRedcap.prototype.expGivenOnUse = 5;
ItemRedcap.prototype.baseDurability = 1;
ItemRedcap.prototype.useDurabilityCost = 1;