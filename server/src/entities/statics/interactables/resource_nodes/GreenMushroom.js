const ResourceNode = require("./ResourceNode");
const Item = require("../../../../ItemsList").Greencap;

class GreenMushroom extends ResourceNode {}

GreenMushroom.prototype.ItemType = Item;
GreenMushroom.prototype.interactionEnergyCost = 2;
GreenMushroom.prototype.interactionDurabilityCost = 1;
GreenMushroom.prototype.reactivationRate = 20000;
GreenMushroom.prototype.gloryGiven = 10;
GreenMushroom.prototype.taskIDGathered = require("../../../../tasks/TaskTypes").GatherGreencaps.taskID;

module.exports = GreenMushroom;
