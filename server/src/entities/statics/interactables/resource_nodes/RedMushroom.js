const ResourceNode = require("./ResourceNode");
const Item = require("../../../../ItemsList").BY_NAME.Redcap;

class RedMushroom extends ResourceNode {}

RedMushroom.prototype.ItemType = Item;
RedMushroom.prototype.interactionEnergyCost = 2;
RedMushroom.prototype.reactivationRate = 20000;
RedMushroom.prototype.gloryGiven = 10;
RedMushroom.prototype.taskIdGathered = require("../../../../tasks/TaskTypes").GatherRedcaps.taskId;

module.exports = RedMushroom;
