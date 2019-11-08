
const Projectile = require('./Projectile');

class ProjIronArrow extends Projectile {

    handleCollision (collidee) {
        this.damageCollidee(collidee);
    }

}
module.exports = ProjIronArrow;

ProjIronArrow.prototype.registerEntityType();
ProjIronArrow.prototype.attackPower = require('../../../../ModHitPointValues').ProjIronArrow;
ProjIronArrow.prototype.moveRate = 200;
ProjIronArrow.prototype.range = 7;