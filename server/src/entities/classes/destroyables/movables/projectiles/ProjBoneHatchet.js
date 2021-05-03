const Projectile = require("./Projectile");

class ProjBoneHatchet extends Projectile {
    handleCollision(collidee) {
        this.damageCollidee(collidee);
    }
}
module.exports = ProjBoneHatchet;

ProjBoneHatchet.prototype.assignModHitPointConfigs();
ProjBoneHatchet.prototype.moveRate = 500;
ProjBoneHatchet.prototype.range = 2;
