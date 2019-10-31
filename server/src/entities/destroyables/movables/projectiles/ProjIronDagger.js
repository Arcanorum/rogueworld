
const Projectile = require('./Projectile');

class ProjIronDagger extends Projectile {

    handleCollision (collidee) {
        this.damageCollidee(collidee);
    }

}
module.exports = ProjIronDagger;

ProjIronDagger.prototype.registerEntityType();
ProjIronDagger.prototype.attackPower = require('../../../../ModHitPointValues').ProjIronDagger;
ProjIronDagger.prototype.moveRate = 200;
ProjIronDagger.prototype.range = 1;
ProjIronDagger.prototype.hasBackStabBonus = true;
ProjIronDagger.prototype.damageType = ProjIronDagger.prototype.DamageTypes.Melee;