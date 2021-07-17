const Projectile = require("./Projectile");

class ProjIronHammer extends Projectile {
    handleCollision(collidee) {
        this.pushBackCollidee(collidee);
        this.damageCollidee(collidee);
    }
}
module.exports = ProjIronHammer;
