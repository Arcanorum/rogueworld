
const Projectile = require('./Projectile');

class ProjDungiumSword extends Projectile {

    handleCollision (collidee) {
        this.damageCollidee(collidee);
    }

}
module.exports = ProjDungiumSword;

ProjDungiumSword.prototype.registerEntityType();
ProjDungiumSword.prototype.attackPower = require('../../../../ModHitPointValues').ProjDungiumSword;
ProjDungiumSword.prototype.moveRate = 200;
ProjDungiumSword.prototype.range = 3;
ProjDungiumSword.prototype.collisionType = ProjDungiumSword.prototype.CollisionTypes.Melee;