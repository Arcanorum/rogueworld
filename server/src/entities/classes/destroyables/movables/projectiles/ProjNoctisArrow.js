const Projectile = require("./Projectile");

class ProjNoctisArrow extends Projectile {
    handleCollision(collidee) {
        this.damageCollidee(collidee);
    }
}
module.exports = ProjNoctisArrow;

ProjNoctisArrow.prototype.assignModHitPointConfigs();
ProjNoctisArrow.prototype.moveRate = 100;
ProjNoctisArrow.prototype.range = 8;
