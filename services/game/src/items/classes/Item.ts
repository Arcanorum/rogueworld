/* eslint-disable-next-line max-classes-per-file */
import { RowCol } from '@rogueworld/types';
import Pickup from '../../entities/classes/Pickup';
import Player from '../../entities/classes/Player';
import { EntitiesList } from '../../entities';
import { ItemState } from '../../inventory';
// import { TaskTypes } from '../../tasks';
import DamageTypes from '../../gameplay/DamageTypes';
import { StatusEffect } from '../../gameplay/status_effects';
import Entity from '../../entities/classes/Entity';
import { Action } from '../../gameplay/actions';
import DamageModifier from '../../gameplay/DamageModifier';

class Item {
    /**
     * Need this here to check if this class is abstract during runtime so the abstract classes can
     * be separated in the items list.
     */
    static abstract = true;

    /**
     * Whether this item has had it's destroy method called, and is just waiting to be GCed, so
     * shouldn't be usable any more.
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
     * The ids of the task types that will be progressed on a player that crafts this item, from
     * any recipe it is a result of.
     * Can be multiple, i.e. crafting iron arrows would progress both "CraftIronGear" and
     * "CraftArrows" tasks.
     */
    static craftTaskIds: Array<string> = [];

    /**
     * The type of entity to be added to the board if this item is dropped on the ground.
     * The class itself, NOT an instance of it.
     * If left null, the item to drop will disappear and won't leave anything on the ground.
     */
    static PickupType: typeof Pickup | null = null;

    /**
     * A flag of wether this item type does something when used, such as starting an action,
     * restoring HP, or giving stat exp.
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
    static healingOnUseAmount = 0;

    /**
     * How many hitpoints to take when this item is used.
     */
    static damageOnUseAmount = 0;

    /**
     * What damage types should be used when dealing damage with damageOnUseAmount.
     */
    static damageOnUseTypes: Array<DamageTypes> = [DamageTypes.Physical];

    /**
     * How much penetration should be used when dealing damage with damageOnUseAmount.
     */
    static damageOnUsePenetration = 100;

    /**
     * Any modifiers to apply to the damage dealt to certain categories of entity.
     */
    static damageOnUseModifiers?: Array<DamageModifier> = undefined;

    /**
     * How much food to restore when this item is used.
     */
    static foodOnUseAmount = 0;

    /**
     * What status effects will be applied to the user when this item is used.
     */
    static statusEffectsOnUse: Array<typeof StatusEffect> = [];

    static EntityTypeSpawnedOnUse?: typeof Entity = undefined;

    /**
     * How far away in tiles (Manhattan distance) the target of this item can be away from the
     * owner.
     */
    static useRange?: number = undefined;

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
    }

    static assignPickupType(itemName: string) {
        // Don't bother having a pickup type file. Just create one for each item
        // type, as it will always be 1-1 (except items that cannot be dropped).

        class GenericPickup extends Pickup { }
        GenericPickup.ItemType = this;

        GenericPickup.registerEntityType();

        this.PickupType = GenericPickup;

        GenericPickup.typeName = `Pickup${itemName}`;

        // Add the pickup to the entities list, so it can still be manually instantiated, for
        // spawners.
        EntitiesList.BY_NAME[GenericPickup.typeName] = GenericPickup;
    }

    checkUseCriteria(targetEntity?: Entity, targetPosition?: RowCol) { return true; }

    /**
     * Activate the effect of this item. i.e. Restore energy, equip armour, use tool.
     */
    use(targetEntity?: Entity, targetPosition?: RowCol) {
        if (!this.checkUseCriteria(targetEntity, targetPosition)) return;

        const ItemType = this.constructor as typeof Item;
        const action: Action = { name: ItemType.typeName, duration: 1000 };
        this.owner.performAction(
            action,
            targetEntity,
            targetPosition?.row,
            targetPosition?.col,
            () => {
                this.onUsed(targetEntity, targetPosition);
            },
        );
    }

    onUsed(targetEntity?: Entity, targetPosition?: RowCol) {
        // Keep a reference to the owner, as if the item gets destroyed when used
        // here, owner will be nulled, but still want to be able to send events.
        const { owner } = this;

        // Something might have happened to the owner of this item when it was used by them.
        // Such as eating a greencap on 1HP to suicide, but then owner is null.
        if (!owner) return;

        // Target the owner if no other entity was specified.
        if (!targetEntity) targetEntity = owner;

        const ItemType = this.constructor as typeof Item;

        if (ItemType.useGloryCost) owner.modGlory(-ItemType.useGloryCost);

        if (ItemType.hasUseEffect) {
            if (ItemType.healingOnUseAmount) {
                targetEntity?.heal({ amount: ItemType.healingOnUseAmount }, owner);
            }

            if (ItemType.damageOnUseAmount) {
                targetEntity?.damage({
                    amount: ItemType.damageOnUseAmount,
                    types: ItemType.damageOnUseTypes,
                    penetration: ItemType.damageOnUsePenetration,
                    bonuses: ItemType.damageOnUseModifiers,
                }, owner);
            }

            if (ItemType.foodOnUseAmount) {
                owner.modFood(ItemType.foodOnUseAmount);
            }

            if (ItemType.statusEffectsOnUse.length > 0) {
                ItemType.statusEffectsOnUse.forEach((eachStatusEffect) => {
                    targetEntity?.addStatusEffect(eachStatusEffect, owner);
                });
            }

            if (ItemType.EntityTypeSpawnedOnUse) {
                if (targetPosition && owner.board) {
                    new ItemType.EntityTypeSpawnedOnUse({
                        row: targetPosition?.row,
                        col: targetPosition?.col,
                        board: owner.board,
                    }).emitToNearbyPlayers();
                }
            }

            // // Check if this item gives any stat exp when used.
            // if (owner.stats[this.expGivenStatName] !== undefined) {
            //     owner.stats[this.expGivenStatName].gainExp(this.expGivenOnUse);
            // }

            this.modQuantity(-1);

            // Tell the user the item was used. Might not have had an immediate effect, but
            // the client might like to know right away (i.e. to play a sound effect).
            owner.socket?.sendEvent(
                'item_used',
                { itemTypeCode: ItemType.typeCode },
            );
        }
    }

    equip() { }

    unequip() { }

    modQuantity(amount: number) {
        // Check a valid value was given.
        if (!amount) return;

        this.itemState.modQuantity(amount);

        // Check if the stack is now empty.
        if (this.itemState.quantity < 1) {
            // Remove this empty item stack.
            // This needs to be done here as some items can use each other (e.g. bows using arrows).
            this.owner.inventory.removeItemBySlotIndex(this.slotIndex);
        }
        else {
            // Tell the player the new quantity.
            this.owner.socket?.sendEvent(
                'modify_inventory_item',
                {
                    slotIndex: this.slotIndex,
                    quantity: this.itemState.quantity,
                    totalWeight: this.itemState.totalWeight,
                },
            );

            // If this player has an account, save the new quantity.
            if (this.owner.socket?.account) {
                this.owner.socket.account.inventoryItems[this.slotIndex].quantity = (
                    this.itemState.quantity
                );
            }
        }
    }
}

export default Item;
