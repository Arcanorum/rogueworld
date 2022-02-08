import { message } from '@dungeonz/utils';
import { World } from './space';
import './Server';
// Init the list of task types before loading items.
import './tasks/TaskTypesList';
import { ItemsLoader } from './items';

message('Starting game server.');

async function init() {
    World.init();

    ItemsLoader.populateList();

    ItemsLoader.initialiseList();

    ItemsLoader.createCatalogue();

    message('Game server started.');
}

init();
