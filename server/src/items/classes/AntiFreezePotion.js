const Item = require("./Item");
const { ColdResistance } = require("../../gameplay/StatusEffects");

class AntiFreezePotion extends Item {
    checkUseCriteria() {
        // Don't bother if they already have a cold resistance effect active.
        if (this.owner.statusEffects[ColdResistance.name]) {
            return false;
        }

        return super.checkUseCriteria();
    }

    onUsed() {
        this.owner.addStatusEffect(ColdResistance);

        super.onUsed();
    }
}

module.exports = AntiFreezePotion;
