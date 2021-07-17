const Projectile = require("./Projectile");
const Character = require("../characters/Character");
const Heal = require("../../../../../gameplay/Heal");

class ProjVampireFang extends Projectile {
    handleCollision(collidee) {
        this.damageCollidee(collidee);

        if (collidee instanceof Character) {
            // Heal the user.
            this.source.heal(
                new Heal(this.damageAmount * 0.5),
            );
        }
    }
}
module.exports = ProjVampireFang;
