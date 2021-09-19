const Projectile = require("./Projectile");
const StatusEffects = require("../../../../../gameplay/StatusEffects");

class ProjIceArrow extends Projectile {
    handleCollision(collidee) {
        this.damageCollidee(collidee);
        // If it can have status effects, apply chill.
        if (collidee.statusEffects !== undefined) {
            collidee.addStatusEffect(StatusEffects.Chill, this.source);
        }
    }
}
module.exports = ProjIceArrow;
