const ResourceNode = require("./ResourceNode");
const Item = require("../../../../ItemsList").PalmLogs;

class PalmTree extends ResourceNode {}

PalmTree.prototype.ItemType = Item;
PalmTree.prototype.interactionEnergyCost = 2;
PalmTree.prototype.interactionDurabilityCost = 1;
PalmTree.prototype.reactivationRate = 20000;
PalmTree.prototype.requiredToolCategory = Item.prototype.categories.Hatchet;
PalmTree.prototype.warningEvent = PalmTree.prototype.EventsList.hatchet_needed;
PalmTree.prototype.gloryGiven = 10;
// PalmTree.prototype.taskIDGathered = require("../../../../tasks/TaskTypes").ChopPalmTrees.taskID;

module.exports = PalmTree;
