
const Projectile = require('./Projectile');

class ProjSnowball extends Projectile {

    handleCollision (collidee) {
        this.damageCollidee(collidee);
    }

}
module.exports = ProjSnowball;

ProjSnowball.prototype.registerEntityType();
ProjSnowball.prototype.assignModHitPointValues();
ProjSnowball.prototype.moveRate = 200;
ProjSnowball.prototype.range = 4;