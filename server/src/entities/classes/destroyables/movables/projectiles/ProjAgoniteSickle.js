const Projectile = require("./Projectile");

class ProjAgoniteSickle extends Projectile {
    handleCollision(collidee) {
        this.damageCollidee(collidee);
    }
}
module.exports = ProjAgoniteSickle;

ProjAgoniteSickle.prototype.assignModHitPointConfigs();
ProjAgoniteSickle.prototype.moveRate = 500;
ProjAgoniteSickle.prototype.range = 1;
