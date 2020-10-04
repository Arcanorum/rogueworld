
const ResourceNode = require('./ResourceNode');

class GreenMushroom extends ResourceNode {}
module.exports = GreenMushroom;

GreenMushroom.prototype.registerEntityType();

const Item = require('../../../../items/ItemGreencap');
GreenMushroom.prototype.ItemType = Item;
GreenMushroom.prototype.interactionEnergyCost = 2;
GreenMushroom.prototype.interactionDurabilityCost = 1;
GreenMushroom.prototype.reactivationRate = 20000;
GreenMushroom.prototype.gloryGiven = 10;
GreenMushroom.prototype.taskIDGathered = require('../../../../tasks/TaskTypes').GatherGreencaps.taskID;