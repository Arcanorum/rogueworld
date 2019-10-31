
const Projectile = require('./Projectile');

class ProjAcorn extends Projectile {

    handleCollision (collidee) {
        this.damageCollidee(collidee);
    }

}
module.exports = ProjAcorn;

ProjAcorn.prototype.registerEntityType();
ProjAcorn.prototype.attackPower = require('../../../../ModHitPointValues').ProjAcorn;
ProjAcorn.prototype.moveRate = 200;
ProjAcorn.prototype.range = 6;