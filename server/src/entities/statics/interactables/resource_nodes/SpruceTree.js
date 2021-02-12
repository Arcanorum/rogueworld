const ResourceNode = require("./ResourceNode");
const Item = require("../../../../ItemsList").SpruceLogs;

class SpruceTree extends ResourceNode {}

SpruceTree.prototype.ItemType = Item;
SpruceTree.prototype.interactionEnergyCost = 2;
SpruceTree.prototype.interactionDurabilityCost = 1;
SpruceTree.prototype.reactivationRate = 20000;
SpruceTree.prototype.requiredToolCategory = Item.prototype.categories.Hatchet;
SpruceTree.prototype.warningEvent = SpruceTree.prototype.EventsList.hatchet_needed;
SpruceTree.prototype.gloryGiven = 10;
// SpruceTree.prototype.taskIDGathered = require("../../../../tasks/TaskTypes").ChopSpruceTrees.taskID;

module.exports = SpruceTree;
