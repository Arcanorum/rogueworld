const Projectile = require("./Projectile");

class ProjAgoniteSword extends Projectile {
    handleCollision(collidee) {
        this.damageCollidee(collidee);
    }
}
module.exports = ProjAgoniteSword;

ProjAgoniteSword.prototype.assignModHitPointConfigs();
ProjAgoniteSword.prototype.moveRate = 200;
ProjAgoniteSword.prototype.range = 3;
ProjAgoniteSword.prototype.collisionType = ProjAgoniteSword.prototype.CollisionTypes.Melee;
