const Projectile = require("./Projectile");
const Character = require("../characters/Character");
const MagicEffects = require("../../../../../gameplay/MagicEffects");

class ProjIllOmen extends Projectile {
    handleCollision(collidee) {
        // Check any of the conditions that should always be checked.
        super.mandatoryCollideeChecks(collidee);

        // If it is a character, apply the ill omen effect.
        if (collidee instanceof Character) {
            if (collidee === this.source) return;

            new MagicEffects.IllOmen({ character: collidee, source: this.source });

            this.destroy();
        }
    }
}
module.exports = ProjIllOmen;
