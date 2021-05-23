const Projectile = require("./Projectile");

class ProjAgoniteHatchet extends Projectile {
    handleCollision(collidee) {
        this.damageCollidee(collidee);
    }
}
module.exports = ProjAgoniteHatchet;

ProjAgoniteHatchet.prototype.assignModHitPointConfigs();
ProjAgoniteHatchet.prototype.moveRate = 500;
ProjAgoniteHatchet.prototype.range = 2;
