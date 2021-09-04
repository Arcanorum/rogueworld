const Projectile = require("./Projectile");

class ProjTailwind extends Projectile {
    handleCollision(collidee) {
        // Ignore other wind projectiles.
        if (collidee instanceof ProjTailwind) return;

        this.pushBackCollidee(collidee, 2);
    }
}
module.exports = ProjTailwind;
