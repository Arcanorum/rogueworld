
const Projectile = require('./Projectile');

class ProjNoctisSword extends Projectile {

    handleCollision (collidee) {
        this.damageCollidee(collidee);
    }

}
module.exports = ProjNoctisSword;

ProjNoctisSword.prototype.registerEntityType();
ProjNoctisSword.prototype.attackPower = require('../../../../ModHitPointValues').ProjNoctisSword;
ProjNoctisSword.prototype.moveRate = 200;
ProjNoctisSword.prototype.range = 3;
ProjNoctisSword.prototype.damageType = ProjNoctisSword.prototype.DamageTypes.Melee;