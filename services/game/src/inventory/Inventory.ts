import { Settings } from '@dungeonz/configs';
import Player from '../entities/classes/Player';
import Item from '../items/classes/Item';

class Inventory {
    owner: Player;

    weight = 0;

    maxWeight = Settings.MAX_INVENTORY_WEIGHT || 1000;

    /**
     * A list of the item instances that can be used, equipped etc. in this inventory.
     */
    items:Array<Item> = [];

    constructor(owner: Player) {
        this.owner = owner;
    }
}

export default Inventory;
