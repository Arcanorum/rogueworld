const Projectile = require("./Projectile");
const StatusEffects = require("../../../../../gameplay/StatusEffects");

class ProjPoisonArrow extends Projectile {
    handleCollision(collidee) {
        this.damageCollidee(collidee);
        // If it can have status effects, apply poison.
        if (collidee.statusEffects !== undefined) {
            collidee.addStatusEffect(StatusEffects.Poison, this.source);
        }
    }
}
module.exports = ProjPoisonArrow;
