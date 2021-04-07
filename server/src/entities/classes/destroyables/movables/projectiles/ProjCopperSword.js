const Projectile = require("./Projectile");

class ProjCopperSword extends Projectile {
    handleCollision(collidee) {
        this.damageCollidee(collidee);
    }
}
module.exports = ProjCopperSword;

ProjCopperSword.prototype.assignModHitPointConfigs();
ProjCopperSword.prototype.moveRate = 200;
ProjCopperSword.prototype.range = 3;
ProjCopperSword.prototype.collisionType = ProjCopperSword.prototype.CollisionTypes.Melee;
