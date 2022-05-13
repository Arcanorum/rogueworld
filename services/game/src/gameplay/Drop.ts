import ItemsList from '../items/ItemsList';
import Pickup from '../entities/classes/Pickup';
import { error } from '@rogueworld/utils';

export interface DropConfig {
    itemName: string;
    quantity: number;
    dropRate: number;
    rolls: number;
}

class Drop {
    /**
     * The item pickup entity to be created when this item is dropped.
     */
    PickupType!: typeof Pickup;

    /**
     * How many separate chances to get the item.
     */
    rolls = 1;

    /**
     * The chance of getting the item on each roll.
     */
    dropRate = 20;

    quantity = 1;

    constructor(config: DropConfig) {
        if (!ItemsList.BY_NAME[config.itemName]) {
            error(`Cannot add to drop list. Drop item name "${config.itemName}" does not exist in the items list.
         Check the name of the item to add is correct, and that it is in the items list.`);
        }

        const ItemPickupType = ItemsList.BY_NAME[config.itemName].PickupType;

        if(!ItemPickupType) {
            error(`Cannot add to drop list. Drop item name "${config.itemName}" does not have a pickup, and so cannot be made droppable.`);
            return;
        }

        this.PickupType = ItemPickupType;

        if (typeof this.PickupType !== 'function') {
            error(`Cannot add to drop list, pickup entity is not a function/class. Is it disabled?: ${config.itemName}`);
        }

        if (this.PickupType.prototype instanceof Pickup === false) {
            error('Cannot add to drop list, imported entity type does not extend type Pickup. Config:', config);
        }

        if (config.quantity) {
            if (!ItemsList.BY_NAME[config.itemName].baseQuantity) {
                error('Cannot add to drop list, drop config specifies quantity for non-stackable item type. Config:', config);
            }
            this.quantity = config.quantity;
        }

        // Use config if set.
        if (config.rolls !== undefined) {
            // Check it is valid.
            if (Number.isInteger(config.rolls) === false) error(`Mob item drop rolls must be an integer. Config:${config}`);
            if (config.rolls < 1) error('Mob item drop rolls must be greater than 1. Config:', config);

            this.rolls = config.rolls;
        }

        // Use config if set.
        if (config.dropRate !== undefined) {
            // Check it is valid.
            if (config.dropRate <= 0 || config.dropRate > 100) error(`Mob item drop rate must be greater than 0, up to 100, i.e. 40 => 40% chance. Config:${config}`);

            this.dropRate = config.dropRate;
        }
        // Otherwise use the item pickup default drop rate if it is defined.
        else {
            this.dropRate = this.PickupType.dropRate;
        }
    }
}

export default Drop;
