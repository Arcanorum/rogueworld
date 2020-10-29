const Item = require("./Item");

class DungiumHatchet extends Item {

    use () {
        this.useGatheringTool();
    }

}

DungiumHatchet.translationID = "Dungium hatchet";
DungiumHatchet.iconSource = "icon-dungium-hatchet";
DungiumHatchet.prototype.category = Item.prototype.categories.Hatchet;
DungiumHatchet.prototype.baseDurability = 50;
DungiumHatchet.prototype.expGivenStatName = DungiumHatchet.prototype.StatNames.Gathering;
DungiumHatchet.prototype.expGivenOnUse = 10;

module.exports = DungiumHatchet;