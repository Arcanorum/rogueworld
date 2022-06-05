import { RowCol } from '@rogueworld/types';
import Entity from '../../../entities/classes/Entity';
import { Action } from '../../../gameplay/actions';
import Item from '../Item';

abstract class Holdable extends Item {
    static abstract = true;

    destroy() {
        // If this item is being held, take it off the owner.
        if (this.owner.holding === this) {
            this.owner.modHolding();
        }
        super.destroy();
    }

    use() {
        this.equip();
    }

    useWhileHeld(targetEntity?: Entity, targetPosition?: RowCol) {
        if (this.checkUseCriteria({ targetEntity, targetPosition })) {
            const ItemType = this.constructor as typeof Item;
            const action: Action = { name: ItemType.typeName, duration: 1000 };
            this.owner.performAction(
                action,
                targetEntity,
                targetPosition?.row,
                targetPosition?.col,
                () => {
                    this.onUsedWhileHeld(targetEntity, targetPosition);
                },
            );
        }
    }

    /**
     * Use this held item. Typically attacks.
     */
    onUsedWhileHeld(targetEntity?: Entity, targetPosition?: RowCol) {
        this.onUsed(targetEntity, targetPosition);
    }

    equip() {
        const { owner } = this;

        // If this item is already being held, take it off.
        if (owner.holding === this) {
            this.unequip();
        }
        // Owner is trying to hold something else.
        else {
            // If they are already holding something when putting the new holdable on.
            if (owner.holding) {
                // Remove the CURRENT item before holding another one.
                owner.holding.unequip();
            }
            this.owner.modHolding(this);
        }
    }

    unequip() {
        this.owner.modHolding();
    }
}

export default Holdable;
