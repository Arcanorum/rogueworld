const Clothes = require("./Clothes");

class ArmorOfIre extends Clothes {
    modDurability() {
        // Overwrite this with nothing so it doesn't lose durability.
    }

    onDamaged(damage, source) {
        // Check the entity can be damaged.
        // Source might be null, when damaged by the environment.
        if (source && source.damage) {
            // Only damage the source if this player has glory.
            if (this.owner.glory > Math.abs(damage.amount)) {
                this.owner.modGlory(-damage.amount);
                source.damage(damage, this.owner);
            }
        }

        super.onDamaged(damage, source);
    }
}

module.exports = ArmorOfIre;
