
const Projectile = require('./Projectile');

class ProjDungiumHammer extends Projectile {

    handleCollision (collidee) {
        this.pushBackCollidee(collidee);
        this.damageCollidee(collidee);
    }

}
module.exports = ProjDungiumHammer;

ProjDungiumHammer.prototype.registerEntityType();
ProjDungiumHammer.prototype.attackPower = require('../../../../ModHitPointValues').ProjDungiumHammer;
ProjDungiumHammer.prototype.moveRate = 200;
ProjDungiumHammer.prototype.range = 2;
ProjDungiumHammer.prototype.damageType = ProjDungiumHammer.prototype.DamageTypes.Melee;