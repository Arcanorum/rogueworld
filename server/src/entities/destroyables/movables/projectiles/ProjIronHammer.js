
const Projectile = require('./Projectile');

class ProjIronHammer extends Projectile {

    handleCollision (collidee) {
        this.pushBackCollidee(collidee);
        this.damageCollidee(collidee);
    }

}
module.exports = ProjIronHammer;

ProjIronHammer.prototype.registerEntityType();
ProjIronHammer.prototype.attackPower = require('../../../../ModHitPointValues').ProjIronHammer;
ProjIronHammer.prototype.moveRate = 200;
ProjIronHammer.prototype.range = 2;
ProjIronHammer.prototype.damageType = ProjIronHammer.prototype.DamageTypes.Melee;