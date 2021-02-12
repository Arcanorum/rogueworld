const ResourceNode = require("./ResourceNode");
const Item = require("../../../../ItemsList").OakLogs;

class OakTree extends ResourceNode {}

OakTree.prototype.ItemType = Item;
OakTree.prototype.interactionEnergyCost = 2;
OakTree.prototype.interactionDurabilityCost = 1;
OakTree.prototype.reactivationRate = 20000;
OakTree.prototype.requiredToolCategory = Item.prototype.categories.Hatchet;
OakTree.prototype.warningEvent = OakTree.prototype.EventsList.hatchet_needed;
OakTree.prototype.gloryGiven = 6;
OakTree.prototype.taskIDGathered = require("../../../../tasks/TaskTypes").GatherOakLogs.taskID;

module.exports = OakTree;
