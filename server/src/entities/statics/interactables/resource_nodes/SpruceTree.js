
const ResourceNode = require('./ResourceNode');

class SpruceTree extends ResourceNode {}
module.exports = SpruceTree;

SpruceTree.prototype.registerEntityType();

const Item = require('../../../../items/ItemOakLogs');
SpruceTree.prototype.ItemType = Item;
SpruceTree.prototype.interactionEnergyCost = 2;
SpruceTree.prototype.interactionDurabilityCost = 1;
SpruceTree.prototype.reactivationRate = 20000;
SpruceTree.prototype.requiredToolCategory = Item.prototype.categories.Hatchet;
SpruceTree.prototype.warningEvent = SpruceTree.prototype.EventsList.hatchet_needed;
SpruceTree.prototype.gloryGiven = 10;
//SpruceTree.prototype.taskIDGathered = require('../../../../tasks/TaskTypes').ChopSpruceTrees.taskID;