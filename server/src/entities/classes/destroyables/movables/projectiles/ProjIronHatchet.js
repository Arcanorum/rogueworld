const Projectile = require("./Projectile");

class ProjIronHatchet extends Projectile {
    handleCollision(collidee) {
        this.damageCollidee(collidee);
    }
}
module.exports = ProjIronHatchet;

ProjIronHatchet.prototype.assignModHitPointConfigs();
ProjIronHatchet.prototype.moveRate = 500;
ProjIronHatchet.prototype.range = 2;
