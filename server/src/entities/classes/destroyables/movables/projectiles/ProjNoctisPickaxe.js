const Projectile = require("./Projectile");

class ProjNoctisPickaxe extends Projectile {
    handleCollision(collidee) {
        this.damageCollidee(collidee);
    }
}
module.exports = ProjNoctisPickaxe;

ProjNoctisPickaxe.prototype.assignModHitPointConfigs();
ProjNoctisPickaxe.prototype.moveRate = 500;
ProjNoctisPickaxe.prototype.range = 2;
