const Item = require("./Item");
const { HealthRegen } = require("../../gameplay/StatusEffects");

class HealthPotion extends Item {
    checkUseCriteria() {
        // Don't waste a use on max HP.
        if (this.owner.hitPoints === this.owner.maxHitPoints) return false;

        return super.checkUseCriteria();
    }

    onUsed() {
        this.owner.addStatusEffect(HealthRegen);

        super.onUsed();
    }
}

module.exports = HealthPotion;
