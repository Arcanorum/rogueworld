const Weapon = require("./Weapon");
const ModHitPointConfigs = require("../../../gameplay/ModHitPointConfigs");
const Damage = require("../../../gameplay/Damage");

class SuperBloodStaff extends Weapon {
    onUsed() {
        // Blood bolt consumes HP on use.
        this.owner.damage(new Damage({
            amount: ModHitPointConfigs.ProjBloodBolt.damageAmount * 0.5,
            types: ModHitPointConfigs.ProjBloodBolt.damageTypes,
            armourPiercing: 100, // Avoid damaging own clothes when using blood staffs.
        }));

        super.onUsed();
    }
}

module.exports = SuperBloodStaff;
