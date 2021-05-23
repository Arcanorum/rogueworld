const Projectile = require("./Projectile");

class ProjAgoniteArrow extends Projectile {
    handleCollision(collidee) {
        this.damageCollidee(collidee);
    }
}
module.exports = ProjAgoniteArrow;

ProjAgoniteArrow.prototype.assignModHitPointConfigs();
ProjAgoniteArrow.prototype.moveRate = 100;
ProjAgoniteArrow.prototype.range = 7;
