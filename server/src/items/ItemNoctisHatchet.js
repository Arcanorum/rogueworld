
const Item = require('./Item');

class ItemNoctisHatchet extends Item {

    use () {
        this.useGatheringTool();
    }

}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemNoctisHatchet;

ItemNoctisHatchet.prototype.registerItemType();
ItemNoctisHatchet.prototype.idName = "Noctis hatchet";
ItemNoctisHatchet.prototype.iconSource = "icon-noctis-hatchet";
ItemNoctisHatchet.prototype.PickupType = require('../entities/destroyables/pickups/PickupNoctisHatchet');
ItemNoctisHatchet.prototype.baseValue = 10;
ItemNoctisHatchet.prototype.category = Item.prototype.categories.Hatchet;
ItemNoctisHatchet.prototype.baseDurability = 40;
ItemNoctisHatchet.prototype.expGivenStatName = ItemNoctisHatchet.prototype.StatNames.Gathering;
ItemNoctisHatchet.prototype.expGivenOnUse = 10;