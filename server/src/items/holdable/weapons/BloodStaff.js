const Weapon = require("./Weapon");
const ProjectileType = require("../../../entities/destroyables/movables/projectiles/ProjBloodBolt");
const ModHitPointConfigs = require("../../../gameplay/ModHitPointConfigs");
const Damage = require("../../../gameplay/Damage");

class BloodStaff extends Weapon {

    onUsed() {
        // Blood bolt consumes HP on use.
        this.owner.damage(new Damage({
            amount: ModHitPointConfigs.ProjBloodBolt.damageAmount * 0.5,
            types: ModHitPointConfigs.ProjBloodBolt.damageTypes
        }));

        super.onUsed();
    }

}

BloodStaff.prototype.translationID = "Blood staff";
BloodStaff.prototype.iconSource = "icon-blood-staff";
BloodStaff.prototype.ProjectileType = ProjectileType;
BloodStaff.prototype.category = Weapon.prototype.categories.Weapon;
BloodStaff.prototype.baseDurability = 30;
BloodStaff.prototype.useDurabilityCost = 1;
BloodStaff.prototype.useEnergyCost = 2;
BloodStaff.prototype.expGivenStatName = BloodStaff.prototype.StatNames.Magic;

module.exports = BloodStaff;