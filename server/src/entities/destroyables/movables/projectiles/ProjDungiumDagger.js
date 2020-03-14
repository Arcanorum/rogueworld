
const Projectile = require('./Projectile');

class ProjDungiumDagger extends Projectile {

    handleCollision (collidee) {
        this.damageCollidee(collidee);
    }

}
module.exports = ProjDungiumDagger;

ProjDungiumDagger.prototype.registerEntityType();
ProjDungiumDagger.prototype.assignModHitPointValues();
ProjDungiumDagger.prototype.moveRate = 200;
ProjDungiumDagger.prototype.range = 1;
ProjDungiumDagger.prototype.hasBackStabBonus = true;
ProjDungiumDagger.prototype.collisionType = ProjDungiumDagger.prototype.CollisionTypes.Melee;