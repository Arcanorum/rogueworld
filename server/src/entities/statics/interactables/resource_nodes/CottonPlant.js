
const ResourceNode = require('./ResourceNode');

class CottonPlant extends ResourceNode {}
module.exports = CottonPlant;

CottonPlant.prototype.registerEntityType();

const Item = require('../../../../items/ItemCotton');
CottonPlant.prototype.ItemType = Item;
CottonPlant.prototype.interactionEnergyCost = 2;
CottonPlant.prototype.interactionDurabilityCost = 1;
CottonPlant.prototype.reactivationRate = 8000;
CottonPlant.prototype.gloryGiven = 4;
CottonPlant.prototype.taskIDGathered = require('../../../../tasks/TaskTypes').GatherCotton.taskID;