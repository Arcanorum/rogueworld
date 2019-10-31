
const Item = require('./Item');

class ItemDungiumHatchet extends Item {

    use () {
        this.useGatheringTool();
    }

}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemDungiumHatchet;

ItemDungiumHatchet.prototype.registerItemType();
ItemDungiumHatchet.prototype.idName = "Dungium hatchet";
ItemDungiumHatchet.prototype.iconSource = "icon-dungium-hatchet";
ItemDungiumHatchet.prototype.PickupType = require('../entities/destroyables/pickups/PickupDungiumHatchet');
ItemDungiumHatchet.prototype.baseValue = 10;
ItemDungiumHatchet.prototype.category = Item.prototype.categories.Hatchet;
ItemDungiumHatchet.prototype.baseDurability = 50;
ItemDungiumHatchet.prototype.expGivenStatName = ItemDungiumHatchet.prototype.StatNames.Gathering;
ItemDungiumHatchet.prototype.expGivenOnUse = 10;