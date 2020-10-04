
const ResourceNode = require('./ResourceNode');

class OakTree extends ResourceNode {}
module.exports = OakTree;

OakTree.prototype.registerEntityType();

const Item = require('../../../../items/ItemOakLogs');
OakTree.prototype.ItemType = Item;
OakTree.prototype.interactionEnergyCost = 2;
OakTree.prototype.interactionDurabilityCost = 1;
OakTree.prototype.reactivationRate = 20000;
OakTree.prototype.requiredToolCategory = Item.prototype.categories.Hatchet;
OakTree.prototype.warningEvent = OakTree.prototype.EventsList.hatchet_needed;
OakTree.prototype.gloryGiven = 6;
OakTree.prototype.taskIDGathered = require('../../../../tasks/TaskTypes').GatherOakLogs.taskID;