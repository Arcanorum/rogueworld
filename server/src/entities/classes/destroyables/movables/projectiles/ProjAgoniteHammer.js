const Projectile = require("./Projectile");
const StatusEffects = require("../../../../../gameplay/StatusEffects");

class ProjAgoniteHammer extends Projectile {
    handleCollision(collidee) {
        this.pushBackCollidee(collidee);
        this.damageCollidee(collidee);
        // If it can have status effects, apply broken bones.
        if (collidee.statusEffects !== undefined) {
            collidee.addStatusEffect(StatusEffects.BrokenBones, this.source);
        }
    }
}
module.exports = ProjAgoniteHammer;
