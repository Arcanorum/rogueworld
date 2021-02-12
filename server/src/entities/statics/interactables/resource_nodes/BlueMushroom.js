const ResourceNode = require("./ResourceNode");
const Item = require("../../../../ItemsList").Bluecap;

class BlueMushroom extends ResourceNode {}

BlueMushroom.prototype.ItemType = Item;
BlueMushroom.prototype.interactionEnergyCost = 2;
BlueMushroom.prototype.interactionDurabilityCost = 1;
BlueMushroom.prototype.reactivationRate = 20000;
BlueMushroom.prototype.gloryGiven = 10;
BlueMushroom.prototype.taskIDGathered = require("../../../../tasks/TaskTypes").GatherBluecaps.taskID;

module.exports = BlueMushroom;
