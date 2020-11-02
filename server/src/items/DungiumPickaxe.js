const Item = require("./Item");

class DungiumPickaxe extends Item {

    use () {
        this.useGatheringTool();
    }

}

DungiumPickaxe.translationID = "Dungium pickaxe";
DungiumPickaxe.iconSource = "icon-dungium-pickaxe";
DungiumPickaxe.prototype.category = Item.prototype.categories.Pickaxe;
DungiumPickaxe.prototype.baseDurability = 50;
DungiumPickaxe.prototype.expGivenStatName = DungiumPickaxe.prototype.StatNames.Gathering;
DungiumPickaxe.prototype.expGivenOnUse = 10;

module.exports = DungiumPickaxe;