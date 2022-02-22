import { message } from '@dungeonz/utils';
import { World } from './space';
import './Server';
import './api';
import './websocket_events';
// Init the list of task types before loading items.
import './tasks/TaskTypesList';
import { ItemsLoader } from './items';
import { EntitiesLoader } from './entities';

message('Starting game server.');

async function init() {
    World.init();

    ItemsLoader.populateList();
    EntitiesLoader.populateList();

    ItemsLoader.initialiseList();
    EntitiesLoader.initialiseList();

    ItemsLoader.createCatalogue();
    EntitiesLoader.createCatalogue();

    message('Game server started.');
}

init();
