
const Projectile = require('./Projectile');

class ProjShuriken extends Projectile {

    handleCollision (collidee) {
        this.damageCollidee(collidee);
    }

}
module.exports = ProjShuriken;

ProjShuriken.prototype.registerEntityType();
ProjShuriken.prototype.assignModHitPointValues();
ProjShuriken.prototype.moveRate = 150;
ProjShuriken.prototype.range = 4;