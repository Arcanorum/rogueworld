const Item = require("./Item");

class NoctisPickaxe extends Item {

    use () {
        this.useGatheringTool();
    }

}

NoctisPickaxe.prototype.translationID = "Noctis pickaxe";
NoctisPickaxe.prototype.iconSource = "icon-noctis-pickaxe";
NoctisPickaxe.prototype.category = Item.prototype.categories.Pickaxe;
NoctisPickaxe.prototype.baseDurability = 40;
NoctisPickaxe.prototype.expGivenStatName = NoctisPickaxe.prototype.StatNames.Gathering;
NoctisPickaxe.prototype.expGivenOnUse = 10;

module.exports = NoctisPickaxe;