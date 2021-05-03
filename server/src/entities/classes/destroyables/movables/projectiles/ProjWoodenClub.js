const Projectile = require("./Projectile");

class ProjWoodenClub extends Projectile {
    handleCollision(collidee) {
        this.damageCollidee(collidee);
    }
}
module.exports = ProjWoodenClub;

ProjWoodenClub.prototype.assignModHitPointConfigs();
ProjWoodenClub.prototype.moveRate = 200;
ProjWoodenClub.prototype.range = 2;
ProjWoodenClub.prototype.collisionType = ProjWoodenClub.prototype.CollisionTypes.Melee;
