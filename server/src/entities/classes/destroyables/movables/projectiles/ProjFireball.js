const Projectile = require("./Projectile");
const { Burn } = require("../../../../../gameplay/StatusEffects");

class ProjFireball extends Projectile {
    handleCollision(collidee) {
        // Check any of the conditions that should always be checked.
        super.mandatoryCollideeChecks(collidee);

        // If it can have status effects, apply burning.
        if (collidee.statusEffects !== undefined) {
            // Don't affect whoever made it.
            if (collidee === this.source) return;

            collidee.addStatusEffect(Burn, this.source);

            this.destroy();
        }
    }
}
module.exports = ProjFireball;
