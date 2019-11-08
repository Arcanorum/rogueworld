
const Weapon = require('./Weapon');

class ItemBloodStaff extends Weapon {

    onUsed () {
        // Blood bolt consumes HP on use.
        this.owner.modHitPoints(-ModHitPointValues.ProjBloodBoltDamage * 0.5);

        super.onUsed();
    }

}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemBloodStaff;

const ProjectileType = require('../../../entities/destroyables/movables/projectiles/ProjBloodBolt');
const ModHitPointValues = require('../../../ModHitPointValues');

ItemBloodStaff.prototype.registerItemType();
ItemBloodStaff.prototype.idName = "Blood staff";
ItemBloodStaff.prototype.PickupType = require('../../../entities/destroyables/pickups/PickupBloodStaff');
ItemBloodStaff.prototype.ProjectileType = ProjectileType;
ItemBloodStaff.prototype.iconSource = "icon-blood-staff";
ItemBloodStaff.prototype.baseValue = 10;
ItemBloodStaff.prototype.category = Weapon.prototype.categories.Weapon;
ItemBloodStaff.prototype.baseDurability = 25;
ItemBloodStaff.prototype.useDurabilityCost = 1;
ItemBloodStaff.prototype.useEnergyCost = 1;
ItemBloodStaff.prototype.expGivenStatName = ItemBloodStaff.prototype.StatNames.Magic;