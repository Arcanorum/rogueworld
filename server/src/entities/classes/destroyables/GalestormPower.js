const EntitiesList = require("../../EntitiesList");
const Destroyable = require("./Destroyable");

class GalestormPower extends Destroyable {
    modHitPoints() {}

    modDirection() {}

    addStatusEffect() {}

    onMovedInto(otherEntity) {
        if (otherEntity instanceof EntitiesList.Player) {
            // Add a point of galestorm power to the player that collected this power-up.
            if (otherEntity.miscData.galestormPower) {
                // Limit the amount of power they can store at once.
                if (otherEntity.miscData.galestormPower < 6) {
                    otherEntity.miscData.galestormPower += 1;
                }
            }
            else {
                otherEntity.miscData.galestormPower = 1;
            }

            this.destroy();
        }
    }
}
module.exports = GalestormPower;
