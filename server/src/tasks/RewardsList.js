
const ItemsList = require('../ItemsList');

/**
 * A list of potential rewards to be given on completion of a task.
 * @type {Array}
 */
const RewardsList = [];

RewardsList.push(ItemsList.ExpOrbMelee);
RewardsList.push(ItemsList.ExpOrbRanged);
RewardsList.push(ItemsList.ExpOrbMagic);
RewardsList.push(ItemsList.ExpOrbGathering);
RewardsList.push(ItemsList.ExpOrbWeaponry);
RewardsList.push(ItemsList.ExpOrbArmoury);
RewardsList.push(ItemsList.ExpOrbToolery);
RewardsList.push(ItemsList.ExpOrbPotionry);
RewardsList.push(ItemsList.WindGem);
RewardsList.push(ItemsList.FireGem);
RewardsList.push(ItemsList.BloodGem);
RewardsList.push(ItemsList.BookOfLight);
RewardsList.push(ItemsList.BookOfSouls);
RewardsList.push(ItemsList.VampireFang);

module.exports = RewardsList;