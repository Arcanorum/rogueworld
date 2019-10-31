
const Projectile = require('./Projectile');

class ProjBloodBolt extends Projectile {

    handleCollision (collidee) {
        // Check any of the conditions that should always be checked.
        super.mandatoryCollideeChecks(collidee);

        if(collidee instanceof Character){
            // Don't cause self-damage for whoever created this projectile.
            if(collidee === this.source) return;

            collidee.damage(this.attackPower, this.source);
            // Blood bolt heals HP on hit.
            this.source.modHitPoints(+ModHitPointValues.ProjBloodBoltHeal);

            this.destroy();
        }

    }

}
module.exports = ProjBloodBolt;

const Character = require('../characters/Character');
const ModHitPointValues = require('../../../../ModHitPointValues');

ProjBloodBolt.prototype.registerEntityType();
ProjBloodBolt.prototype.attackPower = ModHitPointValues.ProjBloodBoltDamage;
ProjBloodBolt.prototype.moveRate = 200;
ProjBloodBolt.prototype.range = 10;