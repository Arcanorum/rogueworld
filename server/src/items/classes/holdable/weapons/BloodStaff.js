const Weapon = require("./Weapon");
const Damage = require("../../../../gameplay/Damage");
const EntitiesList = require("../../../../entities/EntitiesList");

class BloodStaff extends Weapon {
    onUsed() {
        // Blood bolt consumes HP on use.
        this.owner.damage(new Damage({
            amount: EntitiesList.ProjBloodBolt.prototype.damageAmount * 0.5,
            types: EntitiesList.ProjBloodBolt.prototype.damageTypes,
            armourPiercing: 100, // Avoid damaging own clothes when using blood staffs.
        }));

        super.onUsed();
    }
}

module.exports = BloodStaff;
