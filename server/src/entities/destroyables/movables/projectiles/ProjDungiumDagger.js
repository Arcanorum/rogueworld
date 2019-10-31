
const Projectile = require('./Projectile');

class ProjDungiumDagger extends Projectile {

    handleCollision (collidee) {
        this.damageCollidee(collidee);
    }

}
module.exports = ProjDungiumDagger;

ProjDungiumDagger.prototype.registerEntityType();
ProjDungiumDagger.prototype.attackPower = require('../../../../ModHitPointValues').ProjDungiumDagger;
ProjDungiumDagger.prototype.moveRate = 200;
ProjDungiumDagger.prototype.range = 1;
ProjDungiumDagger.prototype.hasBackStabBonus = true;
ProjDungiumDagger.prototype.damageType = ProjDungiumDagger.prototype.DamageTypes.Melee;