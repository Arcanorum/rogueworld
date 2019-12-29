
const ItemsList = require('../ItemsList');

/**
 * A list of potential rewards to be given on completion of a task.
 * @type {Array}
 */
const RewardsList = [];

RewardsList.push(ItemsList.ItemExpOrbMelee);
RewardsList.push(ItemsList.ItemExpOrbRanged);
RewardsList.push(ItemsList.ItemExpOrbMagic);
RewardsList.push(ItemsList.ItemExpOrbGathering);
RewardsList.push(ItemsList.ItemExpOrbWeaponry);
RewardsList.push(ItemsList.ItemExpOrbArmoury);
RewardsList.push(ItemsList.ItemExpOrbToolery);
RewardsList.push(ItemsList.ItemExpOrbPotionry);
RewardsList.push(ItemsList.ItemWindGem);
RewardsList.push(ItemsList.ItemFireGem);
RewardsList.push(ItemsList.ItemBloodGem);
RewardsList.push(ItemsList.ItemBookOfLight);
RewardsList.push(ItemsList.ItemBookOfSouls);
RewardsList.push(ItemsList.ItemVampireFang);

module.exports = RewardsList;