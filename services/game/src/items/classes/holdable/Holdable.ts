import { RowCol } from '@rogueworld/types';
import { tileDistanceBetween } from '@rogueworld/utils';
import Entity from '../../../entities/classes/Entity';
import { Action } from '../../../gameplay/actions';
import Item from '../Item';

abstract class Holdable extends Item {
    static abstract = true;

    static useRange = 1;

    destroy() {
        // If this item is being held, take it off the owner.
        if (this.owner.holding === this) {
            this.owner.modHolding();
        }
        super.destroy();
    }

    checkUseCriteria(targetEntity?: Entity, targetPosition?: RowCol) {
        const ItemType = this.constructor as typeof Item;

        if(ItemType.useRange) {
            const target = targetEntity || targetPosition;
            if(!target) return false;

            if(tileDistanceBetween(this.owner, target) > ItemType.useRange) {
                return false;
            }
        }

        if(ItemType.entityTypeSpawnedOnUse) {
            if(!targetPosition) return false;

            if(ItemType.entityTypeSpawnedOnUse.lowBlocking) {
                const targetTile = this.owner.board?.getTileAt(
                    targetPosition.row,
                    targetPosition.col,
                );
                // Check the target tile is valid.
                if(!targetTile) return false;

                if(!targetTile.isBuildable()) return false;
            }
        }

        return true;
    }

    postActionCheckUseCriteria(targetEntity?: Entity, targetPosition?: RowCol) {
        const ItemType = this.constructor as typeof Item;

        if(ItemType.entityTypeSpawnedOnUse) {
            if(!targetPosition) return false;

            if(ItemType.entityTypeSpawnedOnUse.lowBlocking) {
                const targetTile = this.owner.board?.getTileAt(
                    targetPosition.row,
                    targetPosition.col,
                );
                // Check the target tile is valid.
                if(!targetTile) return false;

                if(!targetTile.isBuildable()) return false;
            }
        }

        return true;
    }

    use() {
        this.equip();
    }

    useWhileHeld(targetEntity?: Entity, targetPosition?: RowCol) {
        if (!this.checkUseCriteria(targetEntity, targetPosition)) return;

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

    /**
     * Use this held item.
     */
    onUsedWhileHeld(targetEntity?: Entity, targetPosition?: RowCol) {
        // Need to make sure it can still be used here, as the board state may have changed during the action. i.e. tile now blocked while building.
        if(!this.postActionCheckUseCriteria(targetEntity, targetPosition)) return;

        if(!targetEntity && targetPosition) {
            const boardTile = this.owner.board?.getTileAt(targetPosition.row, targetPosition.col);
            if(!boardTile) return;

            targetEntity = boardTile.getFirstEntity();
            if(!targetEntity) {
                const ItemType = this.constructor as typeof Item;
                if(!ItemType.entityTypeSpawnedOnUse) return;
            }
        }

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
