const Projectile = require("./Projectile");
const Character = require("../characters/Character");
const Damage = require("../../../../../gameplay/Damage");
const Heal = require("../../../../../gameplay/Heal");

class ProjBloodBolt extends Projectile {
    handleCollision(collidee) {
        // Check any of the conditions that should always be checked.
        super.mandatoryCollideeChecks(collidee);

        if (collidee instanceof Character) {
            // Don't cause self-damage for whoever created this projectile.
            if (collidee === this.source) return;

            collidee.damage(
                new Damage({
                    amount: this.damageAmount,
                    types: this.damageTypes,
                    armourPiercing: this.damageArmourPiercing,
                }),
                this.source,
            );
            // Blood bolt heals HP on hit.
            if (this.source && this.source.heal) {
                this.source.heal(
                    new Heal(this.healAmount),
                );
            }

            this.destroy();
        }
    }
}
module.exports = ProjBloodBolt;

ProjBloodBolt.prototype.assignModHitPointConfigs();
ProjBloodBolt.prototype.moveRate = 200;
ProjBloodBolt.prototype.range = 6;
