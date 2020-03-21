
const Projectile = require('./Projectile');

class ProjBloodBolt extends Projectile {

    handleCollision (collidee) {
        // Check any of the conditions that should always be checked.
        super.mandatoryCollideeChecks(collidee);

        if(collidee instanceof Character){
            // Don't cause self-damage for whoever created this projectile.
            if(collidee === this.source) return;

            collidee.damage(
                new Damage({
                    amount: this.damageAmount,
                    types: this.damageTypes,
                    armourPiercing: this.damageArmourPiercing
                }),
                this.source
            );
            // Blood bolt heals HP on hit.
            this.source.heal(
                new Heal(this.healAmount)
            );

            this.destroy();
        }

    }

}
module.exports = ProjBloodBolt;

const Character = require('../characters/Character');
const Damage = require('../../../../Damage');
const Heal = require('../../../../Heal');

ProjBloodBolt.prototype.registerEntityType();
ProjBloodBolt.prototype.assignModHitPointConfigs();
ProjBloodBolt.prototype.moveRate = 200;
ProjBloodBolt.prototype.range = 10;