const Item = require("./Item");
const EnergyRegen = require("../gameplay/StatusEffects").EnergyRegen;

class EnergyPotion extends Item {

    onUsed () {
        // Don't waste a use on max energy.
        if(this.owner.energy === this.owner.maxEnergy) return;
        this.owner.addStatusEffect(EnergyRegen);

        super.onUsed();
    }

}

EnergyPotion.translationID = "Energy potion";
EnergyPotion.iconSource = "icon-energy-potion";
EnergyPotion.prototype.craftingExpValue = 20;
EnergyPotion.prototype.baseDurability = 5;
EnergyPotion.prototype.useDurabilityCost = 1;

module.exports = EnergyPotion;