const Item = require("./Item");

class PitKey extends Item {

    use () {
        this.useGatheringTool();
    }

}

PitKey.prototype.translationID = "Pit key";
PitKey.prototype.iconSource = "icon-pit-key";
PitKey.prototype.baseDurability = 1;
PitKey.prototype.category = Item.prototype.categories.PitKey;

module.exports = PitKey;