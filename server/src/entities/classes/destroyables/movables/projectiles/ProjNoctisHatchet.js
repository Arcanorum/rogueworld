const Projectile = require("./Projectile");

class ProjNoctisHatchet extends Projectile {
    handleCollision(collidee) {
        this.damageCollidee(collidee);
    }
}
module.exports = ProjNoctisHatchet;

ProjNoctisHatchet.prototype.assignModHitPointConfigs();
ProjNoctisHatchet.prototype.moveRate = 500;
ProjNoctisHatchet.prototype.range = 2;
