const Damage = require("../../../../../gameplay/Damage");
const Projectile = require("./Projectile");

class ProjTailwind extends Projectile {
    handleCollision(collidee) {
        // Ignore other wind projectiles.
        if (collidee instanceof ProjTailwind) return;

        this.pushBackCollidee(collidee, 2);

        collidee.damage(
            new Damage({
                amount: this.damageAmount,
                types: this.damageTypes,
                armourPiercing: this.damageArmourPiercing,
            }),
            this.source,
        );
    }
}
module.exports = ProjTailwind;
