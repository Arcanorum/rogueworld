import { initService, message } from '@rogueworld/utils';
initService();
import { GroundTypes, World } from './space';
import './Server';
import './api';
import './websocket_events';
// Init the list of task types before loading items.
import './tasks/TaskTypesList';
import './gameplay/actions';
import { ItemsLoader } from './items';
import { EntitiesLoader } from './entities';
import { CraftingRecipesLoader } from './crafting';
import { StarterInventoryItemStates } from './inventory';
import { connect } from './database';

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

    await connect();

    GroundTypes.init();
    World.init();

    message('Game service started.');
}

init();
