const Projectile = require("./Projectile");

class ProjDungiumHammer extends Projectile {
    handleCollision(collidee) {
        this.pushBackCollidee(collidee);
        this.damageCollidee(collidee);
    }
}
module.exports = ProjDungiumHammer;
