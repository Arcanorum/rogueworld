const Projectile = require("./Projectile");

class ProjAgoniteDagger extends Projectile {
    handleCollision(collidee) {
        this.damageCollidee(collidee);
    }
}
module.exports = ProjAgoniteDagger;

ProjAgoniteDagger.prototype.assignModHitPointConfigs();
ProjAgoniteDagger.prototype.moveRate = 200;
ProjAgoniteDagger.prototype.range = 1;
ProjAgoniteDagger.prototype.hasBackStabBonus = true;
ProjAgoniteDagger.prototype.collisionType = ProjAgoniteDagger.prototype.CollisionTypes.Melee;
