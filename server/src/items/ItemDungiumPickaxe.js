
const Item = require('./Item');

class ItemDungiumPickaxe extends Item {

    use () {
        this.useGatheringTool();
    }

}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemDungiumPickaxe;

ItemDungiumPickaxe.prototype.registerItemType();
ItemDungiumPickaxe.prototype.idName = "Dungium pickaxe";
ItemDungiumPickaxe.prototype.iconSource = "icon-dungium-pickaxe";
ItemDungiumPickaxe.prototype.PickupType = require('../entities/destroyables/pickups/PickupDungiumPickaxe');
ItemDungiumPickaxe.prototype.baseValue = 10;
ItemDungiumPickaxe.prototype.category = Item.prototype.categories.Pickaxe;
ItemDungiumPickaxe.prototype.baseDurability = 50;
ItemDungiumPickaxe.prototype.expGivenStatName = ItemDungiumPickaxe.prototype.StatNames.Gathering;
ItemDungiumPickaxe.prototype.expGivenOnUse = 10;
