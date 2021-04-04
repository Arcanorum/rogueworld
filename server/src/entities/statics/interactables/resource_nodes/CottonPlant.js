const ResourceNode = require("./ResourceNode");
const Item = require("../../../../ItemsList").BY_NAME.Cotton;

class CottonPlant extends ResourceNode {}

CottonPlant.prototype.ItemType = Item;
CottonPlant.prototype.interactionEnergyCost = 2;
CottonPlant.prototype.reactivationRate = 8000;
CottonPlant.prototype.gloryGiven = 4;
CottonPlant.prototype.taskIdGathered = require("../../../../tasks/TaskTypes").GatherCotton.taskId;

module.exports = CottonPlant;
