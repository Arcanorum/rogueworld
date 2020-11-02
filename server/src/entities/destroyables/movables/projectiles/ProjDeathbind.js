
const Projectile = require('./Projectile');

class ProjDeathbind extends Projectile {

    handleCollision (collidee) {
        // Check any of the conditions that should always be checked.
        super.mandatoryCollideeChecks(collidee);

        // If it is a character, apply the deathbind effect.
        if(collidee instanceof Character){
            if(collidee === this.source) return;

            new MagicEffects.Deathbind(collidee);

            this.destroy();
        }
    }

}
module.exports = ProjDeathbind;

const Character = require('../characters/Character');
const MagicEffects = require('../../../../gameplay/MagicEffects');

ProjDeathbind.prototype.registerEntityType();
ProjDeathbind.prototype.moveRate = 200;
ProjDeathbind.prototype.range = 10;