
const ResourceNode = require('./ResourceNode');

class NoctisOre extends ResourceNode {}
module.exports = NoctisOre;

NoctisOre.prototype.registerEntityType();

const Item = require('../../../../items/ItemNoctisOre');
NoctisOre.prototype.ItemType = Item;
NoctisOre.prototype.interactionEnergyCost = 3;
NoctisOre.prototype.interactionDurabilityCost = 1;
NoctisOre.prototype.reactivationRate = 40000;
NoctisOre.prototype.requiredToolCategory = Item.prototype.categories.Pickaxe;
NoctisOre.prototype.warningEvent = NoctisOre.prototype.EventsList.pickaxe_needed;
NoctisOre.prototype.gloryGiven = 20;
NoctisOre.prototype.taskIDGathered = require('../../../../tasks/TaskTypes').GatherNoctisOre.taskID;