const Projectile = require("./Projectile");

class ProjDungiumArrow extends Projectile {
    handleCollision(collidee) {
        this.damageCollidee(collidee);
    }
}
module.exports = ProjDungiumArrow;

ProjDungiumArrow.prototype.assignModHitPointConfigs();
ProjDungiumArrow.prototype.moveRate = 100;
ProjDungiumArrow.prototype.range = 7;
