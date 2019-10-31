
const Item = require('./Item');

class ItemHealthPotion extends Item {

    onUsed () {
        // Don't waste a use on max HP.
        if(this.owner.hitPoints === this.owner.maxHitPoints) return;
        this.owner.addStatusEffect(HealthRegen);

        super.onUsed();
    }

}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemHealthPotion;

const HealthRegen = require('./../StatusEffects').HealthRegen;

ItemHealthPotion.prototype.registerItemType();
ItemHealthPotion.prototype.idName = "Health potion";
ItemHealthPotion.prototype.PickupType = require('../entities/destroyables/pickups/PickupHealthPotion');
ItemHealthPotion.prototype.craftingExpValue = 20;
ItemHealthPotion.prototype.iconSource = "icon-health-potion";
ItemHealthPotion.prototype.baseDurability = 5;
ItemHealthPotion.prototype.useDurabilityCost = 1;
