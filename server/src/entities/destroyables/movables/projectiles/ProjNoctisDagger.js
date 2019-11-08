
const Projectile = require('./Projectile');

class ProjNoctisDagger extends Projectile {

    handleCollision (collidee) {
        this.damageCollidee(collidee);
    }

}
module.exports = ProjNoctisDagger;

ProjNoctisDagger.prototype.registerEntityType();
ProjNoctisDagger.prototype.attackPower = require('../../../../ModHitPointValues').ProjNoctisDagger;
ProjNoctisDagger.prototype.moveRate = 200;
ProjNoctisDagger.prototype.range = 1;
ProjNoctisDagger.prototype.hasBackStabBonus = true;
ProjNoctisDagger.prototype.damageType = ProjNoctisDagger.prototype.DamageTypes.Melee;