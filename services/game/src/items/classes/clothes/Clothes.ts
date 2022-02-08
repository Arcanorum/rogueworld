import Entity from '../../../entities/classes/Entity';
import Damage from '../../../gameplay/Damage';
import Item from '../Item';

abstract class Clothes extends Item {
    static abstract = true;

    /**
     * How much to increase the wearers defence by while equipped.
     */
    static defenceBonus = 0;

    destroy() {
        // If this item is being worn, take it off the owner.
        if (this.owner.clothing === this) {
            this.owner.modClothing(null);
            // Tell nearby players the owner entity is now wearing nothing.
            this.owner.board.emitToNearbyPlayers(
                this.owner.row,
                this.owner.col,
                'unequip_clothes',
                this.owner.id,
            );
            // Remove the defence bonus of this item from the owner.
            this.owner.modDefence(-this.constructor.prototype.defenceBonus);
        }
        super.destroy();
    }

    use() {
        this.equip();
    }

    onUsed() {
        // Use this empty onUsed method to override the Item.prototype.onUsed one, or this item
        // type will be flagged as unusable and therefore won't be equippable, as it is equipped on use.
        super.onUsed();
    }

    /**
     * Use this clothing item. Typically wears/removes it from the owner.
     */
    equip() {
        const { owner } = this;

        // If this item is already being worn, take it off.
        if (owner.clothing === this) {
            this.unequip();
            // Tell nearby players the owner entity is now wearing nothing.
            owner.board.emitToNearbyPlayers(
                owner.row,
                owner.col,
                'unequip_clothes',
                owner.id,
            );
        }
        // Owner is trying to wear something else.
        else {
            // If they are already wearing something when putting the new clothes on.
            if (owner.clothing !== null) {
                // Remove the CURRENT item before wearing another one.
                owner.clothing.unequip();
            }
            // Equip this item.
            this.owner.modClothing(this);
            // Add the defence bonus of this item to the owner.
            this.owner.modDefence(+this.constructor.prototype.defenceBonus);
            // Tell nearby players the owner entity is now wearing this clothing item.
            owner.board.emitToNearbyPlayers(
                owner.row,
                owner.col,
                'equip_clothes',
                { id: owner.id, typeCode: this.constructor.prototype.typeCode },
            );
        }
    }

    unequip() {
        this.owner.modClothing(null);
        // Remove the defence bonus of this item from the owner.
        this.owner.modDefence(-this.constructor.prototype.defenceBonus);
    }

    /**
     * Deal damage to this clothing item. Reduces the durability.
     */
    damage(damage: Damage, source: Entity) {
        // Reduce the damage taken by the piercing amount.
        // The higher the piercing, the more damage the wearer takes and the less the clothing takes.
        damage.amount *= ((100 - damage.penetration) / 100);
        this.modQuantity(-Math.abs(damage.amount));
        this.onDamaged(damage, source);
    }

    onDamaged(damage: Damage, source: Entity) { return; }
}

export default Clothes;
