const Item = require("./Item");
const { HealthRegen } = require("../gameplay/StatusEffects");

class HealthPotion extends Item {
    onUsed() {
        // Don't waste a use on max HP.
        if (this.owner.hitPoints === this.owner.maxHitPoints) return;
        this.owner.addStatusEffect(HealthRegen);

        super.onUsed();
    }
}

module.exports = HealthPotion;
