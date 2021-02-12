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

Greencap.translationID = "Greencap";
Greencap.iconSource = "icon-greencap";
Greencap.prototype.expGivenStatName = Greencap.prototype.StatNames.Potionry;
Greencap.prototype.expGivenOnUse = 5;
Greencap.prototype.baseDurability = 1;
Greencap.prototype.useDurabilityCost = 1;

module.exports = Greencap;
