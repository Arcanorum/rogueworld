const Projectile = require("./Projectile");

class ProjAgoniteHammer extends Projectile {
    handleCollision(collidee) {
        this.pushBackCollidee(collidee);
        this.damageCollidee(collidee);
    }
}
module.exports = ProjAgoniteHammer;
