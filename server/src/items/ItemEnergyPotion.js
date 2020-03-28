
const Item = require('./Item');

class ItemEnergyPotion extends Item {

    onUsed () {
        // Don't waste a use on max energy.
        if(this.owner.energy === this.owner.maxEnergy) return;
        this.owner.addStatusEffect(EnergyRegen);

        super.onUsed();
    }

}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemEnergyPotion;

const EnergyRegen = require('./../gameplay/StatusEffects').EnergyRegen;

ItemEnergyPotion.prototype.registerItemType();
ItemEnergyPotion.prototype.idName = "Energy potion";
ItemEnergyPotion.prototype.PickupType = require('../entities/destroyables/pickups/PickupEnergyPotion');
ItemEnergyPotion.prototype.craftingExpValue = 20;
ItemEnergyPotion.prototype.iconSource = "icon-energy-potion";
ItemEnergyPotion.prototype.baseDurability = 5;
ItemEnergyPotion.prototype.useDurabilityCost = 1;
