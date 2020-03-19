
const Projectile = require('./Projectile');

class ProjWind extends Projectile {

    handleCollision (collidee) {
        this.pushBackCollidee(collidee);

        collidee.damage(
            new Damage({
                amount: this.damageAmount,
                types: this.damageTypes,
                armourPiercing: this.damageArmourPiercing
            }),
            this.source
        );
    }

}
module.exports = ProjWind;

const Damage = require('../../../../Damage');

ProjWind.prototype.registerEntityType();
ProjWind.prototype.assignModHitPointConfigs();
ProjWind.prototype.moveRate = 200;
ProjWind.prototype.range = 10;