const Item = require("./Item");
const { HealthRegen } = require("../../gameplay/StatusEffects");
const StatusEffects = require("../../gameplay/StatusEffects");

class HealthPotion extends Item {
    checkUseCriteria() {
        // Don't waste a use on max HP.
        if (this.owner.hitPoints === this.owner.maxHitPoints) return false;

        // Don't bother if they already have a healing effect active.
        if (this.owner.statusEffects[StatusEffects.HealthRegen.name]) return false;

        return super.checkUseCriteria();
    }

    onUsed() {
        this.owner.addStatusEffect(HealthRegen);

        super.onUsed();
    }
}

module.exports = HealthPotion;
