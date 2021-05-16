const Projectile = require("./Projectile");

class ProjDungiumSickle extends Projectile {
    handleCollision(collidee) {
        this.damageCollidee(collidee);
    }
}
module.exports = ProjDungiumSickle;

ProjDungiumSickle.prototype.assignModHitPointConfigs();
ProjDungiumSickle.prototype.moveRate = 500;
ProjDungiumSickle.prototype.range = 1;
