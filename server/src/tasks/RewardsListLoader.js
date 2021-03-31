const ItemsListByName = require("../ItemsList").BY_NAME;
const Utils = require("../Utils");
const RewardsList = require("./RewardsList");

const populateList = () => {
    Utils.message("Populating task rewards list.");

    RewardsList.push(ItemsListByName.ExpOrbMelee);
    RewardsList.push(ItemsListByName.ExpOrbRanged);
    RewardsList.push(ItemsListByName.GloryOrb);
    RewardsList.push(ItemsListByName.ExpOrbMagic);
    RewardsList.push(ItemsListByName.ExpOrbGathering);
    RewardsList.push(ItemsListByName.ExpOrbWeaponry);
    RewardsList.push(ItemsListByName.ExpOrbArmoury);
    RewardsList.push(ItemsListByName.ExpOrbToolery);
    RewardsList.push(ItemsListByName.ExpOrbPotionry);
    RewardsList.push(ItemsListByName.WindGem);
    RewardsList.push(ItemsListByName.FireGem);
    RewardsList.push(ItemsListByName.BloodGem);
    RewardsList.push(ItemsListByName.VampireFang);

    // Check they are all valid. Might be wrong names, so are undefined.
    RewardsList.forEach((ItemType, index) => {
        if (!ItemType) Utils.error("Invalid item type added to task rewards list at index:", index);
    });

    Utils.message("Finished populating task rewards list.");
};

module.exports = {
    populateList,
};
