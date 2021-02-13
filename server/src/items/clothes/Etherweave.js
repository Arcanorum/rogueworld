const Clothes = require("./Clothes");

class Etherweave extends Clothes {
    modDurability() {
        // Overwrite this with nothing so it doesn't lose durability.
        // TODO: change this to be propery check based on Item proto.
    }

    onDamaged(amount, source) {
        // Check the entity can be damaged.
        if (source.damage) {
            // Only give the player energy if they have glory.
            if (this.owner.glory > Math.abs(amount)) {
                this.owner.modGlory(amount);
                // Give energy when damaged.
                this.owner.modEnergy(Math.abs(amount));
            }
        }

        super.onDamaged(amount, source);
    }
}

module.exports = Etherweave;
