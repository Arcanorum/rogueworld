
const Projectile = require('./Projectile');

class ProjNoctisArrow extends Projectile {

    handleCollision (collidee) {
        this.damageCollidee(collidee);
    }

}
module.exports = ProjNoctisArrow;

ProjNoctisArrow.prototype.registerEntityType();
ProjNoctisArrow.prototype.attackPower = require('../../../../ModHitPointValues').ProjNoctisArrow;
ProjNoctisArrow.prototype.moveRate = 200;
ProjNoctisArrow.prototype.range = 7;