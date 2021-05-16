const Projectile = require("./Projectile");

class ProjIronSickle extends Projectile {
    handleCollision(collidee) {
        this.damageCollidee(collidee);
    }
}
module.exports = ProjIronSickle;

ProjIronSickle.prototype.assignModHitPointConfigs();
ProjIronSickle.prototype.moveRate = 500;
ProjIronSickle.prototype.range = 1;
