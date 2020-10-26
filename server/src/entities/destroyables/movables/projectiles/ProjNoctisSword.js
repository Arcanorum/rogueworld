const Projectile = require('./Projectile');

class ProjNoctisSword extends Projectile {

    handleCollision (collidee) {
        this.damageCollidee(collidee);
    }

}
module.exports = ProjNoctisSword;

ProjNoctisSword.prototype.assignModHitPointConfigs();
ProjNoctisSword.prototype.moveRate = 200;
ProjNoctisSword.prototype.range = 3;
ProjNoctisSword.prototype.collisionType = ProjNoctisSword.prototype.CollisionTypes.Melee;