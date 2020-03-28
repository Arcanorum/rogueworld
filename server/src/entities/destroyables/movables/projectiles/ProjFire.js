
const Projectile = require('./Projectile');

class ProjFire extends Projectile {

    handleCollision (collidee) {
        // Check any of the conditions that should always be checked.
        super.mandatoryCollideeChecks(collidee);

        // If it can have status effects, apply burning.
        if(collidee.statusEffects !== undefined){
            // Don't affect whoever made it.
            if(collidee === this.source) return;

            collidee.addStatusEffect(Burn, this.source);

            this.destroy();
        }

    }

}
module.exports = ProjFire;

const Burn = require('./../../../../gameplay/StatusEffects').Burn;

ProjFire.prototype.registerEntityType();
ProjFire.prototype.moveRate = 200;
ProjFire.prototype.range = 10;