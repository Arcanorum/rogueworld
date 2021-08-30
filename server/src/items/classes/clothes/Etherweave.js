const Clothes = require("./Clothes");

class Etherweave extends Clothes {
    onDamaged(damage, source) {
        // Only give the player energy if they have glory.
        if (this.owner.glory > damage.amount) {
            this.owner.modGlory(-damage.amount);
            // Give energy when damaged.
            this.owner.modEnergy(damage.amount);
        }

        super.onDamaged(damage, source);
    }
}

module.exports = Etherweave;
