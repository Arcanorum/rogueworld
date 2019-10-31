
const Item = require('./Item');

class ItemCurePotion extends Item {

    onUsed () {
        this.owner.addStatusEffect(Cured);

        super.onUsed();
    }

}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemCurePotion;

const Cured = require('./../StatusEffects').Cured;

ItemCurePotion.prototype.registerItemType();
ItemCurePotion.prototype.idName = "Cure potion";
ItemCurePotion.prototype.PickupType = require('../entities/destroyables/pickups/PickupCurePotion');
ItemCurePotion.prototype.craftingExpValue = 40;
ItemCurePotion.prototype.iconSource = "icon-cure-potion";
ItemCurePotion.prototype.baseDurability = 6;
ItemCurePotion.prototype.useDurabilityCost = 1;
