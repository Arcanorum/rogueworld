const Projectile = require("./Projectile");

class ProjNoctisSickle extends Projectile {
    handleCollision(collidee) {
        this.damageCollidee(collidee);
    }
}
module.exports = ProjNoctisSickle;

ProjNoctisSickle.prototype.assignModHitPointConfigs();
ProjNoctisSickle.prototype.moveRate = 500;
ProjNoctisSickle.prototype.range = 1;
