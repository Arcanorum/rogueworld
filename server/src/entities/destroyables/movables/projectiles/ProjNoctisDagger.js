
const Projectile = require('./Projectile');

class ProjNoctisDagger extends Projectile {

    handleCollision (collidee) {
        this.damageCollidee(collidee);
    }

}
module.exports = ProjNoctisDagger;

ProjNoctisDagger.prototype.registerEntityType();
ProjNoctisDagger.prototype.assignModHitPointValues();
ProjNoctisDagger.prototype.moveRate = 200;
ProjNoctisDagger.prototype.range = 1;
ProjNoctisDagger.prototype.hasBackStabBonus = true;
ProjNoctisDagger.prototype.collisionType = ProjNoctisDagger.prototype.CollisionTypes.Melee;