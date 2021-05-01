const Projectile = require("./Projectile");

class ProjIronPickaxe extends Projectile {
    handleCollision(collidee) {
        this.damageCollidee(collidee);
    }
}
module.exports = ProjIronPickaxe;

ProjIronPickaxe.prototype.assignModHitPointConfigs();
ProjIronPickaxe.prototype.moveRate = 500;
ProjIronPickaxe.prototype.range = 2;
