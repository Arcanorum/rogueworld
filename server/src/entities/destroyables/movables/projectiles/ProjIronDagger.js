const Projectile = require("./Projectile");

class ProjIronDagger extends Projectile {

    handleCollision (collidee) {
        this.damageCollidee(collidee);
    }

}
module.exports = ProjIronDagger;

ProjIronDagger.prototype.assignModHitPointConfigs();
ProjIronDagger.prototype.moveRate = 200;
ProjIronDagger.prototype.range = 1;
ProjIronDagger.prototype.hasBackStabBonus = true;
ProjIronDagger.prototype.collisionType = ProjIronDagger.prototype.CollisionTypes.Melee;