import { warning } from '@rogueworld/utils';
import { v4 as uuidv4 } from 'uuid';
import Item from '../items/classes/Item';

class ItemState {
    /**
     * The class/type of this item (NOT an instance).
     */
    ItemType: typeof Item;

    /**
     * The ID of an existing item loaded from an account.
     */
    id: string;

    /**
     * The size of the stack of this item.
     */
    quantity: number;

    /**
     * How big this item stack can be before it overflows into a new stack.
     */
    static MAX_QUANTITY = 9999;

    /**
     * How much this item (or each unit of a stack) contributes to the total weight of the owner.
     */
    totalWeight = 0;

    /**
     * The main unit that all of the item related systems (inventory, bank, crafting, shops,
     * pickups) use to understand the form/configuration of a given item.
     * Can be passed around between these systems, such as to a pickup for it to hold as the item
     * it represents, or from the pickup to the inventory, or from inventory to bank, or where ever.
     * Does all necessary item type validation with the given properties, to avoid having to grab
     * and check the needed properties each time it is passed around.
     */
    constructor({
        ItemType,
        id,
        quantity,
    }: {
        ItemType: typeof Item;
        id?: string;
        quantity?: number;
    }) {
        this.ItemType = ItemType;

        // Add a unique id to stop React crying when this item is used in displaying a list, and so
        // it can be saved on the account so it can be loaded into the hotbar in the same position.
        this.id = id || uuidv4();

        if (!ItemType) {
            warning('ItemState constructor, ItemType is not a valid item type.');
            throw new Error('Failed ItemState validation.');
        }

        // Use a given quantity, or default to the base value for quantity from the item type.
        // Also handles the case for older saved items that used durability, so they can fall back
        // to the default base quantity for that item type.
        if(quantity) {
            this.quantity = Math.floor(quantity);
        }
        else {
            this.quantity = this.ItemType.baseQuantity;
        }

        this.totalWeight = this.quantity * this.ItemType.unitWeight;
    }

    /**
     * Useful for when needing to modify the config directly.
     */
    modQuantity(amount: number) {
        this.quantity += amount;
        this.quantity = Math.floor(this.quantity);
        // Caclulate the new weight.
        this.totalWeight = Math.floor(this.quantity * this.ItemType.unitWeight);
    }
}

export default ItemState;
