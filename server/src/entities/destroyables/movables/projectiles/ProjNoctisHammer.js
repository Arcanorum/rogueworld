
const Projectile = require('./Projectile');

class ProjNoctisHammer extends Projectile {

    handleCollision (collidee) {
        this.pushBackCollidee(collidee);
        this.damageCollidee(collidee);
    }

}
module.exports = ProjNoctisHammer;

ProjNoctisHammer.prototype.registerEntityType();
ProjNoctisHammer.prototype.assignModHitPointValues();
ProjNoctisHammer.prototype.moveRate = 200;
ProjNoctisHammer.prototype.range = 2;
ProjNoctisHammer.prototype.collisionType = ProjNoctisHammer.prototype.CollisionTypes.Melee;