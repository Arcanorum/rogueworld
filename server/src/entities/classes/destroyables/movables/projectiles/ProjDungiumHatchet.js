const Projectile = require("./Projectile");

class ProjDungiumHatchet extends Projectile {
    handleCollision(collidee) {
        this.damageCollidee(collidee);
    }
}
module.exports = ProjDungiumHatchet;

ProjDungiumHatchet.prototype.assignModHitPointConfigs();
ProjDungiumHatchet.prototype.moveRate = 500;
ProjDungiumHatchet.prototype.range = 2;
