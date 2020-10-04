
const ResourceNode = require('./ResourceNode');

class RedMushroom extends ResourceNode {}
module.exports = RedMushroom;

RedMushroom.prototype.registerEntityType();

const Item = require('../../../../items/ItemRedcap');
RedMushroom.prototype.ItemType = Item;
RedMushroom.prototype.interactionEnergyCost = 2;
RedMushroom.prototype.interactionDurabilityCost = 1;
RedMushroom.prototype.reactivationRate = 20000;
RedMushroom.prototype.gloryGiven = 10;
RedMushroom.prototype.taskIDGathered = require('../../../../tasks/TaskTypes').GatherRedcaps.taskID;