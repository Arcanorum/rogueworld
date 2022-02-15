import { Settings } from '@dungeonz/configs';
import { message, warning } from '@dungeonz/utils';
import { ItemState } from '.';
import { AccountDocument } from '../account';
import Player from '../entities/classes/Player';
import { ItemsList } from '../items';
import Item from '../items/classes/Item';

class Inventory {
    owner: Player;

    weight = 0;

    maxWeight = Settings.MAX_INVENTORY_WEIGHT || 1000;

    /**
     * A list of the item instances that can be used, equipped etc. in this inventory.
     */
    items: Array<Item> = [];

    constructor(owner: Player) {
        this.owner = owner;
    }

    loadData(account: AccountDocument) {
        // Add the stored items to this player's inventory.
        account.inventoryItems.forEach((inventoryItem, index) => {
            try {
                let itemState;

                // Check the type of item to add is valid.
                // Might have been removed since this player last logged in.
                if (!inventoryItem || !ItemsList.BY_CODE[inventoryItem.typeCode]) {
                    // Give them something else instead so the slot indexes don't get messed up.
                    itemState = new ItemState({
                        ItemType: ItemsList.BY_NAME.GloryOrb,
                    });
                }
                else {
                    // Make new item config instances based on the stored data.
                    itemState = new ItemState({
                        id: inventoryItem.id,
                        ItemType: ItemsList.BY_CODE[inventoryItem.typeCode],
                        quantity: inventoryItem.quantity,
                    });

                    // Update the document with the new id if it didn't already have one (old account).
                    if (itemState.id !== inventoryItem.id) {
                        // Need to use Mongoose setter when modifying array by index directly.
                        // https://mongoosejs.com/docs/faq.html#array-changes-not-saved
                        account.inventoryItems.set(index, {
                            id: itemState.id,
                            typeCode: itemState.ItemType.typeCode,
                            quantity: itemState.quantity,
                        });
                    }
                }

                const item = new itemState.ItemType({
                    itemState,
                    slotIndex: this.items.length,
                    owner: this.owner,
                });

                this.items.push(item);
            }
            catch (err: unknown) {
                warning(err);
            }
        });

        this.updateWeight();
    }

    /**
     * Returns all of the items in the format to be saved to the player account.
     * Used to do the initial save for new player accounts, otherwise the in memory document doesn't
     * have the items they have picked up before creating the account, so they won't be saved.
     */
    getSaveData() {
        return this.items.map((item) => ({
            id: item.itemState.id,
            typeCode: item.itemState.ItemType.typeCode,
            quantity: item.itemState.quantity,
        }));
    }

    print() {
        message('Printing inventory:');
        this.items.forEach((item) => {
            console.log(item.itemState);
        });
    }

    pushItem(item: Item, sendEvent: boolean, skipSave?: boolean) {
        const slotIndex = this.items.length;

        this.items.push(item);

        // Tell the player a new item was added to their inventory.
        if (sendEvent) {
            this.owner.socket.sendEvent(
                'add_inventory_item',
                {
                    slotIndex,
                    typeCode: item.itemState.ItemType.typeCode,
                    id: item.itemState.id,
                    quantity: item.itemState.quantity,
                    totalWeight: item.itemState.totalWeight,
                });
        }

        // If this player has an account, save the new inventory item.
        if (!skipSave && this.owner.socket.account) {
            try {
                // Need to use Mongoose setter when modifying array by index directly.
                // https://mongoosejs.com/docs/faq.html#array-changes-not-saved
                this.owner.socket.account.inventoryItems.set(slotIndex, {
                    typeCode: item.itemState.ItemType.typeCode,
                    id: item.itemState.id,
                    quantity: item.itemState.quantity,
                });
            }
            catch (err) {
                warning(err);
            }
        }
    }

    /**
     * Returns all of the items in this inventory, in a form that is ready to be emitted.
     */
    getEmittableProperties() {
        return {
            weight: this.weight,
            maxWeight: this.maxWeight,
            items: this.items.map((item) => ({
                slotIndex: item.slotIndex,
                typeCode: item.itemState.ItemType.typeCode,
                id: item.itemState.id,
                quantity: item.itemState.quantity,
                totalWeight: item.itemState.totalWeight,
            })),
        };
    }

    updateWeight() {
        const originalWeight = this.weight;
        this.weight = 0;

        this.items.forEach((item) => {
            this.weight += item.itemState.totalWeight;
        });

        // Only send if it has changed.
        if (this.weight !== originalWeight) {
            // Tell the player their new inventory weight.
            this.owner.socket.sendEvent('inventory_weight', this.weight);
        }
    }

    updateMaxWeight() {
        // const baseMaxWeight = Settings.MAX_INVENTORY_WEIGHT || 1000;

        // // The setting might be decimal.
        // this.maxWeight = Math.floor(
        //     baseMaxWeight + (
        //         this.owner.stats.getGainedLevels()
        //         * (Settings.ADDITIONAL_MAX_INVENTORY_WEIGHT_PER_STAT_LEVEL || 0)
        //     ),
        // );

        // Tell the player their new max inventory weight.
        this.owner.socket.sendEvent('inventory_max_weight', this.maxWeight);
    }

    quantityThatCanBeAdded(itemState: ItemState) {
        // Check there is enough weight capacity for any of the incoming stack to be added.
        // Might not be able to fit all of it, but still add what can fit.
        const incomingUnitWeight = itemState.ItemType.unitWeight;

        // Skip the weight calculation if the item is weightless.
        // Allow adding the entire quantity.
        if (incomingUnitWeight <= 0) {
            return itemState.quantity;
        }

        const freeWeight = this.maxWeight - this.weight;
        const quantityThatCanFit = Math.floor(freeWeight / incomingUnitWeight);

        // Don't return more than is in the incoming stack.
        // More might be able to fit, but the stack doesn't
        // need all of the available weight.
        if (quantityThatCanFit >= itemState.quantity) {
            return itemState.quantity;
        }

        return quantityThatCanFit;
    }

    canItemBeAdded(config: ItemState) {
        if (!config) return false;

        const { ItemType } = config;

        if (!ItemType) return false;

        if (config.quantity) {
            if (this.quantityThatCanBeAdded(config) > 0) return true;
            return false;
        }

        // Not a stackable or unstackable somehow. Prevent adding.
        return false;
    }

    findNonFullItemTypeStack(ItemType: typeof Item) {
        return this.items.find((item) => {
            if ((item.itemState.ItemType === ItemType)
            // Also check if the stack is not already full.
            && (
                item.itemState.quantity
                < (item.itemState.constructor as typeof ItemState).MAX_QUANTITY)
            ) {
                return true;
            }
            return false;
        });
    }

    /**
     *
     * @param itemState
     * @param forceAdd - Ignore anything that might check and limit how much can be added, such as if it would be over max weight.
     */
    addItem(itemState: ItemState, forceAdd: boolean) {
        if (!(itemState instanceof ItemState)) {
            throw new Error(`'Cannot add item to inventory from a state that is not an instance of ItemState. State:' ${itemState}`);
        }

        if (itemState.quantity) {
            let quantityToAdd = 0;

            if (forceAdd) quantityToAdd = itemState.quantity;
            else quantityToAdd = this.quantityThatCanBeAdded(itemState);

            // Find if a stack for this type of item already exists.
            let nonFullStack = this.findNonFullItemTypeStack(itemState.ItemType);

            while (nonFullStack) {
                // Check there is enough space left in the stack to add these additional ones.
                if (
                    (nonFullStack.itemState.quantity + quantityToAdd)
                    > (nonFullStack.itemState.constructor as typeof ItemState).MAX_QUANTITY
                ) {
                    // Not enough space. Add what can be added and keep the rest where it is, to then
                    // see if another stack of the same type exists that it can be added to instead.

                    const availableQuantity = (
                        (nonFullStack.itemState.constructor as typeof ItemState).MAX_QUANTITY -
                        nonFullStack.itemState.quantity
                    );

                    // Add to the found stack.
                    nonFullStack.modQuantity(+availableQuantity);

                    // Some of the quantity to add has now been added to an existing stack, so reduce the amount
                    // that will go into any other stacks, or into the new overflow stack if no other stack exists.
                    quantityToAdd -= availableQuantity;

                    // Check if there are any other non full stacks that the remainder can be added to.
                    nonFullStack = this.findNonFullItemTypeStack(itemState.ItemType);
                }
                else {
                    // Enough space. Add them all.
                    nonFullStack.modQuantity(+quantityToAdd);

                    // Reduce the size of the incoming stack.
                    itemState.modQuantity(-quantityToAdd);

                    this.updateWeight();

                    // Nothing left to move, so don't add another item below.
                    return;
                }
            }

            // If there is anything left to add after all of the existing stacks have been filled, then
            // make some new stacks.
            // This should only need to add one stack, but catces any weird cases where they somehow
            // try to add a stack larger than the max stack size by splitting it up into smaller stacks.
            while (quantityToAdd > 0) {
                let stackQuantity = quantityToAdd;

                if (itemState.quantity > (itemState.constructor as typeof ItemState).MAX_QUANTITY) {
                    stackQuantity = (itemState.constructor as typeof ItemState).MAX_QUANTITY;
                }

                // Reduce the size of the incoming stack.
                itemState.modQuantity(-stackQuantity);

                const slotIndex = this.items.length;

                // Make a new stack with just the quantity that can fit in the available weight.
                const item = new itemState.ItemType({
                    itemState: new ItemState({
                        ItemType: itemState.ItemType,
                        quantity: stackQuantity,
                    }),
                    slotIndex,
                    owner: this.owner,
                });

                this.pushItem(item, true);

                quantityToAdd -= stackQuantity;
            }
        }
        // Add as an unstackable.
        else {
            const slotIndex = this.items.length;

            // Add the item to the inventory as a new entry as an unstackable.
            const item = new itemState.ItemType({
                itemState,
                slotIndex,
                owner: this.owner,
            });

            this.pushItem(item, true);
        }

        this.updateWeight();
    }

    useItem(slotIndex: number) {
        const item = this.items[slotIndex];
        if (!item) return;

        item.use();

        this.updateWeight();
    }

    removeItemBySlotIndex(slotIndex: number, skipSave?: boolean) {
        if (!this.items[slotIndex]) return;

        // Let the item clean itself up first.
        this.items[slotIndex].destroy();

        // Remove it and squash the hole it left behind.
        // The items list shouldn't be holey.
        this.items.splice(slotIndex, 1);

        // Update the slot indexes of the items.
        this.items.forEach((item, index) => {
            item.slotIndex = index;
        });

        // Tell the player the item was removed from their inventory.
        this.owner.socket.sendEvent('remove_inventory_item', slotIndex);

        // If this player has an account, update their account document that the item has been removed.
        if (!skipSave && this.owner.socket.account) {
            this.owner.socket.account.inventoryItems.splice(slotIndex, 1);
        }

        this.updateWeight();
    }

    removeQuantityFromSlot(slotIndex: number, quantity: number) {
        const item = this.items[slotIndex];
        if (!item) return;

        // Check it is actually a stackable.
        if (!item.itemState.quantity) return;

        // The quantity to remove cannot be higher than the quantity in the stack.
        if (quantity > item.itemState.quantity) {
            quantity = item.itemState.quantity;
            warning('Qutity to remove should not be greater than the quantity in the slot.');
        }

        // Reduce the quantity.
        item.modQuantity(-quantity);

        this.updateWeight();
    }

    removeQuantityByItemType(quantity: number, ItemType: typeof Item) {
        // Check it is actually a stackable.
        if (!ItemType.baseQuantity) return;

        // Find an item in the inventory of the given type.
        const found = this.items.find((item) => item.itemState.ItemType === ItemType);

        if (!found) return;

        // Reduce the quantity.
        found.modQuantity(-quantity);

        this.updateWeight();
    }

    dropItem(slotIndex: number, quantity: number) {
        const item = this.items[slotIndex];
        if (!item) return;

        const { owner } = this;

        const boardTile = owner.getBoardTile();

        // Check the board tile the player is standing on doesn't already have an item or interactable on it.
        if (boardTile.isLowBlocked() === true) {
            // TODO: figure out what to do about this.
            // clientSocket.sendEvent("cannot_drop_here");
            return;
        }

        const PickupType = (item.constructor as typeof Item).PickupType;

        // If no pickup type set, destroy the item without leaving a pickup on the ground.
        if (!PickupType) {
            this.removeItemBySlotIndex(slotIndex);
            return;
        }

        // If a quantity to drop was given, only drop that amount, and keep the rest in the inventory.
        if (quantity && item.itemState.quantity && quantity < item.itemState.quantity) {
            // Remove from the stack.
            item.modQuantity(-quantity);

            // Add a pickup entity of that item to the board,
            // with only the given quantity.
            new PickupType({
                row: owner.row,
                col: owner.col,
                board: owner.board,
                itemState: new ItemState({
                    ItemType: item.itemState.ItemType,
                    quantity,
                }),
            }).emitToNearbyPlayers();
        }
        // Drop the whole thing.
        else {
            // Add a pickup entity of that item to the board.
            new PickupType({
                row: owner.row,
                col: owner.col,
                board: owner.board,
                itemState: item.itemState,
            }).emitToNearbyPlayers();

            this.removeItemBySlotIndex(slotIndex);
        }

        this.updateWeight();

        owner.socket.sendEvent('item_dropped');
    }

    /**
     * Drops all items in this inventory to the ground as pickups.
     */
    dropAllItems() {
        // Don't need to check the board tile to drop on, as
        // if they player is already stood on it, it is valid.
        const { owner } = this;

        this.items.forEach((item) => {
            // If no pickup type set, destroy the item without leaving a pickup on the ground.
            if (!item.PickupType) {
                this.removeItemBySlotIndex(item.slotIndex);
                return;
            }

            // Add a pickup entity of that item to the board.
            new item.PickupType({
                row: owner.row,
                col: owner.col,
                board: owner.board,
                itemConfig: item.itemConfig,
            }).emitToNearbyPlayers();

            // Let the item clean itself up.
            item.destroy();
        });

        // Reset the inventory.
        this.items = [];

        // If this player has an account, save the now empty inventory.
        if (owner.socket.account) {
            try {
                owner.socket.account.inventoryItems = [];
            }
            catch (err) {
                warning(err);
            }
        }

        // Tell the player all items were removed from their inventory.
        owner.socket.sendEvent('remove_all_inventory_items');

        this.updateWeight();
    }

    addStarterItems() {
        starterInventoryItemStatesList.forEach((starterItemState) => {
            // Need to make new item config instances based on the existing ones, instead of just
            // using those ones, so they don't get mutated as they need to be the same every time.
            const slotIndex = this.items.length;

            const item = new starterItemState.ItemType({
                itemConfig: new ItemState(starterItemState),
                slotIndex,
                owner: this.owner,
            });

            // Store the item config in the inventory.
            this.pushItem(item, false);
        });

        this.updateWeight();
    }
}

export default Inventory;
