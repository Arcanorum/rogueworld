const Item = require("./Item");
const { EnergyRegen } = require("../gameplay/StatusEffects");

class EnergyPotion extends Item {
    onUsed() {
        // Don't waste a use on max energy.
        if (this.owner.energy === this.owner.maxEnergy) return;
        this.owner.addStatusEffect(EnergyRegen);

        super.onUsed();
    }
}

module.exports = EnergyPotion;
