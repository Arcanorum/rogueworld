const Projectile = require("./Projectile");

class ProjAgoniteHammer extends Projectile {
    handleCollision(collidee) {
        this.pushBackCollidee(collidee);
        this.damageCollidee(collidee);
    }
}
module.exports = ProjAgoniteHammer;

ProjAgoniteHammer.prototype.assignModHitPointConfigs();
ProjAgoniteHammer.prototype.moveRate = 200;
ProjAgoniteHammer.prototype.range = 2;
ProjAgoniteHammer.prototype.collisionType = ProjAgoniteHammer.prototype.CollisionTypes.Melee;
