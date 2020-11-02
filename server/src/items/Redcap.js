const Item = require("./Item");
const Heal = require("../gameplay/Heal");

class Redcap extends Item {

    onUsed() {
        this.owner.heal(
            new Heal(5)
        );

        super.onUsed();
    }

}

Redcap.translationID = "Redcap";
Redcap.iconSource = "icon-redcap";
Redcap.prototype.craftingExpValue = 10;
Redcap.prototype.expGivenStatName = Redcap.prototype.StatNames.Potionry;
Redcap.prototype.expGivenOnUse = 5;
Redcap.prototype.baseDurability = 1;
Redcap.prototype.useDurabilityCost = 1;

module.exports = Redcap;