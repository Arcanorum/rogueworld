const Item = require("./Item");
const Damage = require("../gameplay/Damage");

class Greencap extends Item {
    onUsed() {
        this.owner.damage(
            new Damage({
                amount: 5,
                types: [Damage.Types.Biological],
                armourPiercing: 100,
            }),
        );

        super.onUsed();
    }
}

module.exports = Greencap;
