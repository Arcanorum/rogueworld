const Weapon = require("./Weapon");
const ProjectileType = require("../../../entities/destroyables/movables/projectiles/ProjSuperBloodBolt");
const ModHitPointConfigs = require("../../../gameplay/ModHitPointConfigs");
const Damage = require("../../../gameplay/Damage");

class SuperBloodStaff extends Weapon {
    onUsed() {
        // Blood bolt consumes HP on use.
        this.owner.damage(new Damage({
            amount: ModHitPointConfigs.ProjBloodBolt.damageAmount * 0.5,
            types: ModHitPointConfigs.ProjBloodBolt.damageTypes,
        }));

        super.onUsed();
    }
}

SuperBloodStaff.translationID = "Super blood staff";
SuperBloodStaff.iconSource = "icon-super-blood-staff";
SuperBloodStaff.prototype.ProjectileType = ProjectileType;
SuperBloodStaff.prototype.category = Weapon.prototype.categories.Weapon;
SuperBloodStaff.prototype.baseDurability = 30;
SuperBloodStaff.prototype.useDurabilityCost = 1;
SuperBloodStaff.prototype.useEnergyCost = 3;
SuperBloodStaff.prototype.expGivenStatName = SuperBloodStaff.prototype.StatNames.Magic;
SuperBloodStaff.prototype.canUseIntoHighBlockedTile = false;

module.exports = SuperBloodStaff;
