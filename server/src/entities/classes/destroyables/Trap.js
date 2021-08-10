const Damage = require("../../../gameplay/Damage");
const Destroyable = require("./Destroyable");

class Trap extends Destroyable {
    modHitPoints() {}

    modDirection() {}

    addStatusEffect() {}

    onMovedInto(otherEntity) {
        otherEntity.damage(new Damage({
            amount: 40,
            types: [Damage.Types.Physical],
            armourPiercing: 50,
        }));

        this.destroy();
    }
}
module.exports = Trap;
