const Item = require("../Item");

class Clothes extends Item {
    destroy() {
        // If this item is being worn, take it off the owner.
        if (this.owner.clothing === this) {
            this.owner.modClothing(null);
            // Tell nearby players the owner entity is now wearing nothing.
            this.owner.board.emitToNearbyPlayers(
                this.owner.row,
                this.owner.col,
                this.owner.EventsList.unequip_clothes,
                this.owner.id,
            );
            // Remove the defence bonus of this item from the owner.
            this.owner.modDefence(-this.defenceBonus);
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
                owner.EventsList.unequip_clothes,
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
            this.owner.modDefence(+this.defenceBonus);
            // Tell nearby players the owner entity is now wearing this clothing item.
            owner.board.emitToNearbyPlayers(
                owner.row,
                owner.col,
                owner.EventsList.equip_clothes,
                { id: owner.id, typeCode: this.typeCode },
            );

            super.equip();
        }
    }

    unequip() {
        this.owner.modClothing(null);
        // Remove the defence bonus of this item from the owner.
        this.owner.modDefence(-this.defenceBonus);
        super.unequip();
    }

    /**
     * Deal damage to this clothing item. Reduces the durability.
     * @param {Damage} damage
     * @param {Entity} source
     */
    damage(damage, source) {
        // Reduce the damage taken by the piercing amount.
        // The higher the piercing, the more damage the wearer takes and the less the clothing takes.
        damage.amount *= ((100 - damage.armourPiercing) / 100);
        this.modDurability(-Math.abs(damage.amount));
        this.onDamaged(damage, source);
    }

    /**
     *
     * @param {Damage} damage
     * @param {Entity} source
     */
    onDamaged(damage, source) { }
}

Clothes.abstract = true;

Clothes.prototype.defenceBonus = 0;
Clothes.prototype.statBonuses = [];

module.exports = Clothes;
