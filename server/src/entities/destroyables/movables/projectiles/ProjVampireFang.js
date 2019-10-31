
const Projectile = require('./Projectile');

class ProjVampireFang extends Projectile {

    handleCollision (collidee) {
        this.damageCollidee(collidee);

        if(collidee instanceof Character){
            // Heal the user.
            this.source.modHitPoints(this.attackPower * 0.5);
        }
    }

}
module.exports = ProjVampireFang;

const Character = require('../characters/Character');

ProjVampireFang.prototype.registerEntityType();
ProjVampireFang.prototype.attackPower = require('../../../../ModHitPointValues').ProjVampireFang;
ProjVampireFang.prototype.moveRate = 200;
ProjVampireFang.prototype.range = 1;