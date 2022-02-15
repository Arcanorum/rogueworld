import { OneMinute } from '@dungeonz/types';
import { ItemState } from '../../inventory';
import Item from '../../items/classes/Item';
import Entity, { EntityConfig } from './Entity';
import Player from './Player';

interface PickupConfig extends EntityConfig {
    itemState: ItemState;
}

class Pickup extends Entity {
    /**
     * A timer to auto destroy this item if it isn't picked up within the given time.
     */
    static lifespan = OneMinute;

    /**
     * The type of item to be added to the inventory of the character that picks this pickup up.
     * The class itself, NOT an instance of it.
     * Set in Item.assignPickupType on server start.
     */
    static ItemType: typeof Item;

    /**
     * The state of the item that this pickup represents.
     * If not defined after instantiation, then it will use the defaults from the ItemType.
     */
    itemState: ItemState | null;

    constructor(config: PickupConfig) {
        super(config);

        this.board?.addPickup(this);

        const _this = this.constructor as typeof Pickup;

        this.itemState = (
            config.itemState ||
            new ItemState({ ItemType: _this.ItemType })
        );
    }

    onDestroy() {
        this.board?.removePickup(this);

        super.onDestroy();
    }

    onDropped(droppedBy: Entity) { return; }

    onPickedUp(pickedUpBy: Player) { return; }
}

export default Pickup;
