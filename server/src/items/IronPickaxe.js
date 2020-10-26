const Item = require("./Item");

class IronPickaxe extends Item {

    use () {
        this.useGatheringTool();
    }

}

IronPickaxe.prototype.translationID = "Iron pickaxe";
IronPickaxe.prototype.iconSource = "icon-iron-pickaxe";
IronPickaxe.prototype.category = Item.prototype.categories.Pickaxe;
IronPickaxe.prototype.baseDurability = 40;
IronPickaxe.prototype.expGivenStatName = IronPickaxe.prototype.StatNames.Gathering;
IronPickaxe.prototype.expGivenOnUse = 10;

module.exports = IronPickaxe;