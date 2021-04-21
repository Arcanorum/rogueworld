const Item = require("./Item");
const { Cured } = require("../../gameplay/StatusEffects");
const StatusEffects = require("../../gameplay/StatusEffects");

class CurePotion extends Item {
    checkUseCriteria() {
        // Don't bother if they already have a cure effect active.
        if (this.owner.statusEffects[StatusEffects.Cured.name]) {
            return false;
        }

        return super.checkUseCriteria();
    }

    onUsed() {
        this.owner.addStatusEffect(Cured);

        super.onUsed();
    }
}

module.exports = CurePotion;
