
const Projectile = require('./Projectile');

class ProjDungiumHammer extends Projectile {

    handleCollision (collidee) {
        this.pushBackCollidee(collidee);
        this.damageCollidee(collidee);
    }

}
module.exports = ProjDungiumHammer;

ProjDungiumHammer.prototype.registerEntityType();
ProjDungiumHammer.prototype.assignModHitPointConfigs();
ProjDungiumHammer.prototype.moveRate = 200;
ProjDungiumHammer.prototype.range = 2;
ProjDungiumHammer.prototype.collisionType = ProjDungiumHammer.prototype.CollisionTypes.Melee;