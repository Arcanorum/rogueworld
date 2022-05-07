import { ItemWeightClasses } from '@dungeonz/configs';
import { ItemCategories } from '@dungeonz/types';
import { error } from '@dungeonz/utils';
import Pickup from '../../entities/classes/Pickup';
import Player from '../../entities/classes/Player';
import { EntitiesList } from '../../entities';
import { ItemState } from '../../inventory';
import { TaskTypes } from '../../tasks';

class Item {
    /**
     * Need this here to check if this class is abstract during runtime so the abstract classes can be
     * separated in the items list.
     */
    static abstract = true;

    /**
     * Whether this item has had it's destroy method called, and is just waiting to be GCed, so shouldn't be usable any more.
     */
    private destroyed = false;

    /**
     * A convenience debug property of the name of this type of item. i.e. IronDagger.
     * Should NOT be saved anywhere for anything persistent. Use `Item.prototype.typeCode` instead.
     */
    static typeName: string;

    /**
     * The unique identifier of this type of item. Should be set in the item values list and never
     * changed, as changing this would invalidate all saved items in player accounts.
     */
    static typeCode: string;

    /**
     * The default quantity for this item when no specific quantity is specified.
     * Defined in the item config values list. If not set, then assume it is a single unit of a
     * stackable item, as that is the most common kind of item type and it would be annoying to
     * have to set `baseQuantity: 1` on so many item configs.
     */
    static baseQuantity = 1;

    /**
     * How much this item (or each unit of a stack) contributes to the total weight of the owner.
     */
    static unitWeight = 0;

    /**
     * How long (in ms) it takes to use this item.
     */
    static useDuration = 0;

    /**
     * How much crafting exp this item contributes to the recipe it is used in.
     */
    static craftingExpValue = 0;

    /**
     * The ids of the task types that will be progressed on a player that crafts this item, from any recipe it is a result of.
     * Can be multiple, i.e. crafting iron arrows would progress both "CraftIronGear" and "CraftArrows" tasks.
     */
    static craftTaskIds: Array<string> = [];

    /**
     * Useful for grouping similar items for checking if a certain kind of tool was used, regardless of
     * what specific tool it was.
     * i.e. any hatchet can be used to cut a tree.
     */
    static categories: Array<ItemCategories> = [];

    /**
     * The type of entity to be added to the board if this item is dropped on the ground. The class itself, NOT an instance of it.
     * If left null, the item to drop will disappear and won't leave anything on the ground.
     */
    static PickupType: typeof Pickup | null = null;

    /**
     * A flag of wether this item type does something when used, such as creating a projectile, restoring HP, or giving stat exp.
     * Not all items are "usable" as such, e.g. materials.
     */
    static hasUseEffect = false;

    /**
     * How much glory it costs for a player to use this item.
     */
    static useGloryCost = 0;

    /**
     * How much stat experience to give when this item is used.
     */
    static expGivenOnUse = 0;

    /**
     * What stat to give experience in when this item is used.
     */
    static expGivenStatName?: string = undefined;

    /**
     * How many hitpoints to give when this item is used.
     */
    static hitPointsGivenOnUse = 0;

    /**
     * What percent to reduce the gather time by for resource nodes.
     */
    static gatherTimeReduction = 0;

    itemState: ItemState;

    slotIndex: number;

    owner: Player;

    constructor({
        itemState,
        slotIndex,
        owner,
    }: {
        itemState: ItemState;
        slotIndex: number;
        owner: Player;
    }) {
        this.itemState = itemState;
        this.slotIndex = slotIndex;
        this.owner = owner;
    }

    destroy() {
        // Prevent multiple destruction of items.
        if (this.destroyed === true) return;
        this.destroyed = true;

        // Dereference other objects so they can be GCed if not needed anywhere else.
        this.owner = Player.prototype;
        this.itemState = ItemState.prototype;
        this.slotIndex = 0;
    }

    static assignPickupType(itemName: string) {
        // Don't bother having a pickup type file. Just create one for each item
        // type, as it will always be 1-1 (except items that cannot be dropped).
        class GenericPickup extends Pickup { }
        GenericPickup.ItemType = this;

        GenericPickup.registerEntityType();

        this.PickupType = GenericPickup;

        GenericPickup.typeName = `Pickup${itemName}`;

        // Add the pickup to the entities list, so it can still be manually instantiated, for spawners.
        EntitiesList.BY_NAME[GenericPickup.typeName] = GenericPickup;
    }

    use() { return; }

    checkUseCriteria(options?: object) { return true; }

    onUsed(options?: object) { return; }

    equip() { return; }

    unequip() { return; }

    modQuantity(amount: number) {
        // Check a valid value was given.
        if (!amount) return;

        this.itemState.modQuantity(amount);

        // Check if the stack is now empty.
        if (this.itemState.quantity < 1) {
            // Remove this empty item stack.
            // This needs to be done here as some items can use each other (e.g. bows using arrows).
            // this.owner.inventory.removeItemBySlotIndex(this.slotIndex); TODO
        }
        else {
            // Tell the player the new quantity.
            this.owner.socket.sendEvent(
                'modify_inventory_item',
                {
                    slotIndex: this.slotIndex,
                    quantity: this.itemState.quantity,
                    totalWeight: this.itemState.totalWeight,
                },
            );

            // If this player has an account, save the new quantity.
            // if (this.owner.socket.account) {
            //     this.owner.socket.account.inventoryItems[this.slotIndex].quantity = ( TODO
            //         this.itemState.quantity
            //     );
            // }
        }
    }
}

export default Item;
