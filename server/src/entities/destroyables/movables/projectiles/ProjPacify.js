
const Projectile = require('./Projectile');

class ProjPacify extends Projectile {

    handleCollision (collidee) {
        // Check any of the conditions that should always be checked.
        super.mandatoryCollideeChecks(collidee);

        // If it is a character, apply the pacify effect.
        if(collidee instanceof Character){
            if(collidee === this.source) return;

            new MagicEffects.Pacify(collidee);

            this.destroy();
        }
    }

}
module.exports = ProjPacify;

const Character = require('../characters/Character');
const MagicEffects = require('../../../../MagicEffects');

ProjPacify.prototype.registerEntityType();
ProjPacify.prototype.moveRate = 200;
ProjPacify.prototype.range = 10;