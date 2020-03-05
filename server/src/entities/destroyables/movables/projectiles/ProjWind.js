
const Projectile = require('./Projectile');

class ProjWind extends Projectile {

    handleCollision (collidee) {
        this.pushBackCollidee(collidee);

        collidee.damage(this.attackPower, this.source);
    }

}
module.exports = ProjWind;

ProjWind.prototype.registerEntityType();
ProjWind.prototype.moveRate = 200;
ProjWind.prototype.range = 10;
ProjWind.prototype.attackPower = require('../../../../ModHitPointValues').ProjWind;