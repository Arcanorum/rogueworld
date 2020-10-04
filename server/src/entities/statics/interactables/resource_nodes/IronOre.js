
const ResourceNode = require('./ResourceNode');

class IronOre extends ResourceNode {}
module.exports = IronOre;

IronOre.prototype.registerEntityType();

const Item = require('../../../../items/ItemIronOre');
IronOre.prototype.ItemType = Item;
IronOre.prototype.interactionEnergyCost = 2;
IronOre.prototype.interactionDurabilityCost = 1;
IronOre.prototype.reactivationRate = 14000;
IronOre.prototype.requiredToolCategory = Item.prototype.categories.Pickaxe;
IronOre.prototype.warningEvent = IronOre.prototype.EventsList.pickaxe_needed;
IronOre.prototype.gloryGiven = 10;
IronOre.prototype.taskIDGathered = require('../../../../tasks/TaskTypes').GatherIronOre.taskID;