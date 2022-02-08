import TargetPosition from '../../../gameplay/TargetPosition';
import Item from '../Item';

abstract class Holdable extends Item {
    static abstract = true;

    destroy() {
        // If this item is being held, take it off the owner.
        if (this.owner.holding === this) {
            this.owner.modHolding(null);
        }
        super.destroy();
    }

    use() {
        this.equip();
    }

    useWhileHeld(targetPosition: TargetPosition) {
        if (this.checkUseCriteria(targetPosition)) {
            this.onUsedWhileHeld(targetPosition);
        }
    }

    /**
     * Use this held item. Typically attacks.
     */
    onUsedWhileHeld(targetPosition: TargetPosition) {
        this.onUsed(targetPosition);
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
            if (owner.holding !== null) {
                // Remove the CURRENT item before holding another one.
                owner.holding.unequip();
            }
            this.owner.modHolding(this);
        }
    }

    unequip() {
        this.owner.modHolding(null);
    }
}

export default Holdable;
