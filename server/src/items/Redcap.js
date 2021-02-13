const Item = require("./Item");
const Heal = require("../gameplay/Heal");

class Redcap extends Item {
    onUsed() {
        this.owner.heal(
            new Heal(5),
        );

        super.onUsed();
    }
}

module.exports = Redcap;
