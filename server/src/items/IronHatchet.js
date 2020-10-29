const Item = require("./Item");

class IronHatchet extends Item {

    use () {
        this.useGatheringTool();
    }

}

IronHatchet.translationID = "Iron hatchet";
IronHatchet.iconSource = "icon-iron-hatchet";
IronHatchet.prototype.category = Item.prototype.categories.Hatchet;
IronHatchet.prototype.baseDurability = 40;
IronHatchet.prototype.expGivenStatName = IronHatchet.prototype.StatNames.Gathering;
IronHatchet.prototype.expGivenOnUse = 10;

module.exports = IronHatchet;