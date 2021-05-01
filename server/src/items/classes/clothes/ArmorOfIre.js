const Damage = require("../../../gameplay/Damage");
const Clothes = require("./Clothes");

class ArmorOfIre extends Clothes {
    onDamaged(damage, source) {
        // Check the entity can be damaged.
        // Source might be null, when damaged by the environment.
        if (source && source.damage) {
            // Reduce the damage dealt each time this method is called.
            // Most of the time this will only be called once when damaged, but there is a case
            // where the source of the damage is also using an item like Armor of Ire, so the
            // damage gets sent back and forth between this method on both items.
            // This reduction each time means there will eventually be an ending point at 0 damage dealt.
            const effectiveDamageAmount = Math.floor(damage.amount - 1);

            if (effectiveDamageAmount > 0) {
                // Only damage the source if this player has glory.
                if (this.owner.glory > Math.abs(effectiveDamageAmount)) {
                    this.owner.modGlory(-effectiveDamageAmount);

                    source.damage(
                        new Damage({
                            amount: effectiveDamageAmount,
                            types: damage.types,
                            armourPiercing: damage.armourPiercing,
                        }),
                        this.owner,
                    );
                }
            }
        }

        super.onDamaged(damage, source);
    }
}

module.exports = ArmorOfIre;
