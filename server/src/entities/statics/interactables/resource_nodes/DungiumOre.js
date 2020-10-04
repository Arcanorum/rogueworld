
const ResourceNode = require('./ResourceNode');

class DungiumOre extends ResourceNode {}
module.exports = DungiumOre;

DungiumOre.prototype.registerEntityType();

const Item = require('../../../../items/ItemDungiumOre');
DungiumOre.prototype.ItemType = Item;
DungiumOre.prototype.interactionEnergyCost = 2;
DungiumOre.prototype.interactionDurabilityCost = 1;
DungiumOre.prototype.reactivationRate = 30000;
DungiumOre.prototype.requiredToolCategory = Item.prototype.categories.Pickaxe;
DungiumOre.prototype.warningEvent = DungiumOre.prototype.EventsList.pickaxe_needed;
DungiumOre.prototype.gloryGiven = 15;
DungiumOre.prototype.taskIDGathered = require('../../../../tasks/TaskTypes').GatherDungiumOre.taskID;