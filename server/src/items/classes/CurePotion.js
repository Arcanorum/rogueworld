const Item = require("./Item");
const { Cured } = require("../../gameplay/StatusEffects");

class CurePotion extends Item {
    onUsed() {
        this.owner.addStatusEffect(Cured);

        super.onUsed();
    }
}

module.exports = CurePotion;
