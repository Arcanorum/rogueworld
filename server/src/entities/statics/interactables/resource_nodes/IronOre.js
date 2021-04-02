const ResourceNode = require("./ResourceNode");
const Item = require("../../../../ItemsList").BY_NAME.IronOre;

class IronOre extends ResourceNode {}

IronOre.prototype.ItemType = Item;
IronOre.prototype.interactionEnergyCost = 2;
IronOre.prototype.reactivationRate = 14000;
IronOre.prototype.requiredToolCategory = Item.prototype.categories.Pickaxe;
IronOre.prototype.warningEvent = IronOre.prototype.EventsList.pickaxe_needed;
IronOre.prototype.gloryGiven = 10;
IronOre.prototype.taskIDGathered = require("../../../../tasks/TaskTypes").GatherIronOre.taskID;

module.exports = IronOre;
