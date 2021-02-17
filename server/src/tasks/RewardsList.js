const ItemsListByName = require("../ItemsList").BY_NAME;

/**
 * A list of potential rewards to be given on completion of a task.
 * @type {Array}
 */
const RewardsList = [];

RewardsList.push(ItemsListByName.ExpOrbMelee);
RewardsList.push(ItemsListByName.ExpOrbRanged);
RewardsList.push(ItemsListByName.ExpOrbMagic);
RewardsList.push(ItemsListByName.ExpOrbGathering);
RewardsList.push(ItemsListByName.ExpOrbWeaponry);
RewardsList.push(ItemsListByName.ExpOrbArmoury);
RewardsList.push(ItemsListByName.ExpOrbToolery);
RewardsList.push(ItemsListByName.ExpOrbPotionry);
RewardsList.push(ItemsListByName.WindGem);
RewardsList.push(ItemsListByName.FireGem);
RewardsList.push(ItemsListByName.BloodGem);
RewardsList.push(ItemsListByName.BookOfLight);
RewardsList.push(ItemsListByName.BookOfSouls);
RewardsList.push(ItemsListByName.VampireFang);

module.exports = RewardsList;
