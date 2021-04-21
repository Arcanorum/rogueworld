const Item = require("./Item");
const { EnergyRegen } = require("../../gameplay/StatusEffects");
const StatusEffects = require("../../gameplay/StatusEffects");

class EnergyPotion extends Item {
    checkUseCriteria() {
        // Don't waste a use on max energy.
        if (this.owner.energy === this.owner.maxEnergy) return false;

        // Don't bother if they already have a energy regen effect active.
        if (this.owner.statusEffects[StatusEffects.EnergyRegen.name]) return false;

        return super.checkUseCriteria();
    }

    onUsed() {
        this.owner.addStatusEffect(EnergyRegen);

        super.onUsed();
    }
}

module.exports = EnergyPotion;
