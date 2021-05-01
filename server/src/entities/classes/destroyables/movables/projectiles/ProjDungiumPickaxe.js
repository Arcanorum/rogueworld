const Projectile = require("./Projectile");

class ProjDungiumPickaxe extends Projectile {
    handleCollision(collidee) {
        this.damageCollidee(collidee);
    }
}
module.exports = ProjDungiumPickaxe;

ProjDungiumPickaxe.prototype.assignModHitPointConfigs();
ProjDungiumPickaxe.prototype.moveRate = 500;
ProjDungiumPickaxe.prototype.range = 2;
