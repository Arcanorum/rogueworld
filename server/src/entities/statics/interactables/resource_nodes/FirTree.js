const ResourceNode = require("./ResourceNode");
const Item = require("../../../../ItemsList").BY_NAME.OakLogs;

class FirTree extends ResourceNode {}

FirTree.prototype.ItemType = Item;
FirTree.prototype.interactionEnergyCost = 2;
FirTree.prototype.reactivationRate = 20000;
FirTree.prototype.requiredToolCategory = Item.prototype.categories.Hatchet;
FirTree.prototype.warningEvent = FirTree.prototype.EventsList.hatchet_needed;
FirTree.prototype.gloryGiven = 6;
FirTree.prototype.taskIDGathered = require("../../../../tasks/TaskTypes").GatherOakLogs.taskID;

module.exports = FirTree;
