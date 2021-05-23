const Projectile = require("./Projectile");

class ProjAgonitePickaxe extends Projectile {
    handleCollision(collidee) {
        this.damageCollidee(collidee);
    }
}
module.exports = ProjAgonitePickaxe;

ProjAgonitePickaxe.prototype.assignModHitPointConfigs();
ProjAgonitePickaxe.prototype.moveRate = 500;
ProjAgonitePickaxe.prototype.range = 2;
