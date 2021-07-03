const Projectile = require("./Projectile");
const Damage = require("../../../../../gameplay/Damage");
const EntitiesList = require("../../../../EntitiesList");

class ProjWind extends Projectile {
    handleCollision(collidee) {
        // Ignore other wind projectiles.
        if (collidee instanceof ProjWind) return;
        if (collidee instanceof EntitiesList.ProjSuperWind) return;

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

ProjWind.prototype.assignModHitPointConfigs();
ProjWind.prototype.moveRate = 200;
ProjWind.prototype.range = 6;
