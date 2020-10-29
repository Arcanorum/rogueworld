const Item = require("./Item");

class FighterKey extends Item {

    use () {
        this.useGatheringTool();
    }

}

FighterKey.translationID = "Fighter key";
FighterKey.iconSource = "icon-fighter-key";
FighterKey.prototype.baseDurability = 1;
FighterKey.prototype.category = Item.prototype.categories.FighterKey;

module.exports = FighterKey;