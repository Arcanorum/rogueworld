const ResourceNode = require("./ResourceNode");
const Item = require("../../../../ItemsList").BY_NAME.OakLogs;

class SpruceTree extends ResourceNode {}

SpruceTree.prototype.ItemType = Item;
SpruceTree.prototype.interactionEnergyCost = 2;
SpruceTree.prototype.reactivationRate = 20000;
SpruceTree.prototype.requiredToolCategory = Item.prototype.categories.Hatchet;
SpruceTree.prototype.warningEvent = SpruceTree.prototype.EventsList.hatchet_needed;
SpruceTree.prototype.gloryGiven = 10;
// SpruceTree.prototype.taskIdGathered = require("../../../../tasks/TaskTypes").ChopSpruceTrees.taskId;

module.exports = SpruceTree;
