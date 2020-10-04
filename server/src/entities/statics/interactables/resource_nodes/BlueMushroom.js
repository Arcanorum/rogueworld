
const ResourceNode = require('./ResourceNode');

class BlueMushroom extends ResourceNode {}
module.exports = BlueMushroom;

BlueMushroom.prototype.registerEntityType();

const Item = require('../../../../items/ItemBluecap');
BlueMushroom.prototype.ItemType = Item;
BlueMushroom.prototype.interactionEnergyCost = 2;
BlueMushroom.prototype.interactionDurabilityCost = 1;
BlueMushroom.prototype.reactivationRate = 20000;
BlueMushroom.prototype.gloryGiven = 10;
BlueMushroom.prototype.taskIDGathered = require('../../../../tasks/TaskTypes').GatherBluecaps.taskID;