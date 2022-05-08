import { message } from '@dungeonz/utils';
import { GroundTypes, World } from './space';
import './Server';
import './api';
import './websocket_events';
// Init the list of task types before loading items.
import './tasks/TaskTypesList';
import { ItemsLoader } from './items';
import { EntitiesLoader } from './entities';

message('Starting game server.');

async function init() {
    ItemsLoader.populateList();
    EntitiesLoader.populateList();

    ItemsLoader.initialiseList();
    EntitiesLoader.initialiseList();

    ItemsLoader.createCatalogue();
    EntitiesLoader.createCatalogue();

    GroundTypes.init();
    World.init();

    message('Game server started.');
}

init();
