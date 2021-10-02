const Damage = require("../../../gameplay/Damage");
const StatusEffects = require("../../../gameplay/StatusEffects");
const Destroyable = require("./Destroyable");

class FireBlast extends Destroyable {
    constructor(config) {
        super(config);

        this.source = config.source || null;

        // Damage all damagable entities on the same tile.
        Object.values(
            this.board.grid[this.row][this.col].destroyables,
        ).forEach((destroyable) => {
            // Ignore itself.
            if (destroyable === this) return;

            destroyable.damage(new Damage({
                amount: 25,
                types: [Damage.Types.Physical, Damage.Types.Magical],
            }), this.source);

            // If it can have status effects, apply burning.
            if (destroyable.statusEffects !== undefined) {
                destroyable.addStatusEffect(StatusEffects.Burn, this.source);
            }
        });
    }

    modHitPoints() {}

    modDirection() {}

    addStatusEffect() {}
}

module.exports = FireBlast;
