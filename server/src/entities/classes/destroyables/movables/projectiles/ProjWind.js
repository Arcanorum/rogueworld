const Projectile = require("./Projectile");

class ProjWind extends Projectile {
    handleCollision(collidee) {
        // Ignore other wind projectiles.
        if (collidee instanceof ProjWind) return;
        if (collidee instanceof ProjSuperWind) return;

        this.pushBackCollidee(collidee);

        collidee.damage(
            new Damage({
                amount: this.damageAmount,
                types: this.damageTypes,
                armourPiercing: this.damageArmourPiercing,
            }),
            this.source,
        );
    }
}
module.exports = ProjWind;

const Damage = require("../../../../../gameplay/Damage");
const ProjSuperWind = require("./ProjSuperWind");

ProjWind.prototype.assignModHitPointConfigs();
ProjWind.prototype.moveRate = 200;
ProjWind.prototype.range = 10;
