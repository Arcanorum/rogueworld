const Item = require("./Item");

class Bluecap extends Item {

    onUsed () {
        this.owner.modEnergy(1);

        super.onUsed();
    }

}

Bluecap.prototype.translationID = "Bluecap";
Bluecap.prototype.iconSource = "icon-bluecap";
Bluecap.prototype.craftingExpValue = 10;
Bluecap.prototype.expGivenStatName = Bluecap.prototype.StatNames.Potionry;
Bluecap.prototype.expGivenOnUse = 5;
Bluecap.prototype.baseDurability = 1;
Bluecap.prototype.useDurabilityCost = 1;

module.exports = Bluecap;