import { message } from '@rogueworld/utils';
import { GroundTypes, World } from './space';
import './Server';
import './api';
import './websocket_events';
// Init the list of task types before loading items.
import './tasks/TaskTypesList';
import { ItemsLoader } from './items';
import { EntitiesLoader } from './entities';
import { CraftingRecipesLoader } from './crafting';
import { StarterInventoryItemStates } from './inventory';
import AccountManager from './account/AccountManager';

message('Starting game service.');

async function init() {
    ItemsLoader.populateList();
    EntitiesLoader.populateList();

    ItemsLoader.initialiseList();
    EntitiesLoader.initialiseList();

    // Do these after the items list is set up, as they need to check the items they use are valid.
    CraftingRecipesLoader.populateList();
    StarterInventoryItemStates.populateList();

    ItemsLoader.createCatalogue();
    EntitiesLoader.createCatalogue();
    CraftingRecipesLoader.createCatalogue();

    GroundTypes.init();
    World.init();

    await AccountManager.setup();

    message('Game service started.');
}

init();
