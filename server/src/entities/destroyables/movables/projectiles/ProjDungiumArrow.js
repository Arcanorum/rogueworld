
const Projectile = require('./Projectile');

class ProjDungiumArrow extends Projectile {

    handleCollision (collidee) {
        this.damageCollidee(collidee);
    }

}
module.exports = ProjDungiumArrow;

ProjDungiumArrow.prototype.registerEntityType();
ProjDungiumArrow.prototype.attackPower = require('../../../../ModHitPointValues').ProjDungiumArrow;
ProjDungiumArrow.prototype.moveRate = 200;
ProjDungiumArrow.prototype.range = 7;