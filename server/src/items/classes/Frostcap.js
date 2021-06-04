const Item = require("./Item");
const { Chill } = require("../../gameplay/StatusEffects");

class Frostcap extends Item {
    onUsed() {
        this.owner.addStatusEffect(Chill);

        super.onUsed();
    }
}

module.exports = Frostcap;
