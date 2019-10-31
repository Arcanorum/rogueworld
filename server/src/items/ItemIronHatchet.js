
const Item = require('./Item');

class ItemIronHatchet extends Item {

    use () {
        this.useGatheringTool();
    }

}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemIronHatchet;

ItemIronHatchet.prototype.registerItemType();
ItemIronHatchet.prototype.idName = "Iron hatchet";
ItemIronHatchet.prototype.iconSource = "icon-iron-hatchet";
ItemIronHatchet.prototype.PickupType = require('../entities/destroyables/pickups/PickupIronHatchet');
ItemIronHatchet.prototype.baseValue = 10;
ItemIronHatchet.prototype.category = Item.prototype.categories.Hatchet;
ItemIronHatchet.prototype.baseDurability = 40;
ItemIronHatchet.prototype.expGivenStatName = ItemIronHatchet.prototype.StatNames.Gathering;
ItemIronHatchet.prototype.expGivenOnUse = 10;