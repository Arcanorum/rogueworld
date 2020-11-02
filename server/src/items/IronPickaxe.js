const Item = require("./Item");

class IronPickaxe extends Item {

    use () {
        this.useGatheringTool();
    }

}

IronPickaxe.translationID = "Iron pickaxe";
IronPickaxe.iconSource = "icon-iron-pickaxe";
IronPickaxe.prototype.category = Item.prototype.categories.Pickaxe;
IronPickaxe.prototype.baseDurability = 40;
IronPickaxe.prototype.expGivenStatName = IronPickaxe.prototype.StatNames.Gathering;
IronPickaxe.prototype.expGivenOnUse = 10;

module.exports = IronPickaxe;