const Projectile = require("./Projectile");

class ProjIronArrow extends Projectile {
    handleCollision(collidee) {
        this.damageCollidee(collidee);
    }
}
module.exports = ProjIronArrow;

ProjIronArrow.prototype.assignModHitPointConfigs();
ProjIronArrow.prototype.moveRate = 100;
ProjIronArrow.prototype.range = 7;
