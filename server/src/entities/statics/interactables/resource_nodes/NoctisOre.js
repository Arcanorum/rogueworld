const ResourceNode = require("./ResourceNode");
const Item = require("../../../../ItemsList").BY_NAME.NoctisOre;

class NoctisOre extends ResourceNode {}

NoctisOre.prototype.ItemType = Item;
NoctisOre.prototype.interactionEnergyCost = 3;
NoctisOre.prototype.interactionDurabilityCost = 1;
NoctisOre.prototype.reactivationRate = 40000;
NoctisOre.prototype.requiredToolCategory = Item.prototype.categories.Pickaxe;
NoctisOre.prototype.warningEvent = NoctisOre.prototype.EventsList.pickaxe_needed;
NoctisOre.prototype.gloryGiven = 20;
NoctisOre.prototype.taskIDGathered = require("../../../../tasks/TaskTypes").GatherNoctisOre.taskID;

module.exports = NoctisOre;
