const Projectile = require('./Projectile');

class ProjIronHammer extends Projectile {

    handleCollision (collidee) {
        this.pushBackCollidee(collidee);
        this.damageCollidee(collidee);
    }

}
module.exports = ProjIronHammer;

ProjIronHammer.prototype.assignModHitPointConfigs();
ProjIronHammer.prototype.moveRate = 200;
ProjIronHammer.prototype.range = 2;
ProjIronHammer.prototype.collisionType = ProjIronHammer.prototype.CollisionTypes.Melee;