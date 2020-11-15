const Projectile = require("./Projectile");

class ProjDark extends Projectile {
    
    handleCollision (collidee) {
        // Heal adumbrals.
        if(
            collidee instanceof SmallAdumbral ||
            collidee instanceof MediumAdumbral ||
            collidee instanceof LargeAdumbral
        ) {
            collidee.heal(new Heal(20));
        }
        else {
            this.damageCollidee(collidee);
        }
    }
    
}
module.exports = ProjDark;

ProjDark.prototype.assignModHitPointConfigs();
ProjDark.prototype.moveRate = 100;
ProjDark.prototype.range = 7;

const SmallAdumbral = require("../characters/mobs/SmallAdumbral");
const MediumAdumbral = require("../characters/mobs/MediumAdumbral");
const LargeAdumbral = require("../characters/mobs/LargeAdumbral");
const Heal = require("../../../../gameplay/Heal");

