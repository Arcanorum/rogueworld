const Projectile = require("./Projectile");

class ProjNoctisHammer extends Projectile {
    handleCollision(collidee) {
        this.pushBackCollidee(collidee);
        this.damageCollidee(collidee);
    }
}
module.exports = ProjNoctisHammer;
