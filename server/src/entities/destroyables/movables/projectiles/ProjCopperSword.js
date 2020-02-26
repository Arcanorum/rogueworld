
const Projectile = require('./Projectile');

class ProjCopperSword extends Projectile {

    handleCollision (collidee) {
        this.damageCollidee(collidee);
    }

}
module.exports = ProjCopperSword;

ProjCopperSword.prototype.registerEntityType();
ProjCopperSword.prototype.attackPower = require('../../../../ModHitPointValues').ProjCopperSword;
ProjCopperSword.prototype.moveRate = 200;
ProjCopperSword.prototype.range = 3;
ProjCopperSword.prototype.damageType = ProjCopperSword.prototype.DamageTypes.Melee;