const ResourceNode = require("./ResourceNode");
const Item = require("../../../../ItemsList").BY_NAME.Bluecap;

class BlueMushroom extends ResourceNode {}

BlueMushroom.prototype.ItemType = Item;
BlueMushroom.prototype.interactionEnergyCost = 2;
BlueMushroom.prototype.reactivationRate = 20000;
BlueMushroom.prototype.gloryGiven = 10;
BlueMushroom.prototype.taskIdGathered = require("../../../../tasks/TaskTypes").GatherBluecaps.taskId;

module.exports = BlueMushroom;
