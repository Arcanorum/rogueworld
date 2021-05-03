const Projectile = require("./Projectile");

class ProjBonePickaxe extends Projectile {
    handleCollision(collidee) {
        this.damageCollidee(collidee);
    }
}
module.exports = ProjBonePickaxe;

ProjBonePickaxe.prototype.assignModHitPointConfigs();
ProjBonePickaxe.prototype.moveRate = 500;
ProjBonePickaxe.prototype.range = 2;
