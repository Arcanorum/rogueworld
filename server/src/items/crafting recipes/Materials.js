
const CraftingManager = require('./../CraftingManager');
const EntitiesList = require('../../entities/EntitiesList');
const ItemsList = require('./../ItemsList');
const StatNames = require('../../stats/Statset').prototype.StatNames;
const TaskTypes = require('../../tasks/TaskTypes');

CraftingManager.addRecipe({ // String
    result:         ItemsList.ItemString,
    craftingStat:   StatNames.Toolery,
    stationType:    EntitiesList.Workbench,
    comp1:          ItemsList.ItemCotton
});

CraftingManager.addRecipe({ // Fabric
    result:         ItemsList.ItemFabric,
    craftingStat:   StatNames.Armoury,
    stationType:    EntitiesList.Workbench,
    comp1:          ItemsList.ItemCotton,
    comp2:          ItemsList.ItemCotton
});