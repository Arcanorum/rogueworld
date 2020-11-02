
const Weapon = require('./Weapon');

class ItemSuperBloodStaff extends Weapon {

    onUsed() {
        // Blood bolt consumes HP on use.
        this.owner.damage(new Damage({
            amount: ModHitPointConfigs.ProjBloodBolt.damageAmount * 0.5,
            types: ModHitPointConfigs.ProjBloodBolt.damageTypes
        }));

        super.onUsed();
    }

}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemSuperBloodStaff;

const ProjectileType = require('../../../entities/destroyables/movables/projectiles/ProjSuperBloodBolt');
const ModHitPointConfigs = require('../../../gameplay/ModHitPointConfigs');
const Damage = require('../../../gameplay/Damage');

ItemSuperBloodStaff.prototype.registerItemType();
ItemSuperBloodStaff.prototype.idName = "Super blood staff";
ItemSuperBloodStaff.prototype.PickupType = require('../../../entities/destroyables/pickups/PickupSuperBloodStaff');
ItemSuperBloodStaff.prototype.ProjectileType = ProjectileType;
ItemSuperBloodStaff.prototype.iconSource = "icon-super-blood-staff";
ItemSuperBloodStaff.prototype.baseValue = 50;
ItemSuperBloodStaff.prototype.category = Weapon.prototype.categories.Weapon;
ItemSuperBloodStaff.prototype.baseDurability = 30;
ItemSuperBloodStaff.prototype.useDurabilityCost = 1;
ItemSuperBloodStaff.prototype.useEnergyCost = 3;
ItemSuperBloodStaff.prototype.expGivenStatName = ItemSuperBloodStaff.prototype.StatNames.Magic;
ItemSuperBloodStaff.prototype.canUseIntoHighBlockedTile = false;