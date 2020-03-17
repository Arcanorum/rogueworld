
const Projectile = require('./Projectile');

class ProjWind extends Projectile {

    handleCollision (collidee) {
        this.pushBackCollidee(collidee);
    }

}
module.exports = ProjWind;

ProjWind.prototype.registerEntityType();
ProjWind.prototype.assignModHitPointConfigs();
ProjWind.prototype.moveRate = 200;
ProjWind.prototype.range = 10;