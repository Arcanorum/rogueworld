const explosion = require("../../../gameplay/Explosion");
const EntitiesList = require("../../EntitiesList");
const Destroyable = require("./Destroyable");

class Bomb extends Destroyable {
    constructor(config) {
        // Prevent lifespan from being passed further along, as it messes with the detonation logic.
        const lifespan = config.lifespan || 2000;
        config.lifespan = undefined;

        super(config);

        this.source = config.source || null;

        this.detonateTimeout = setTimeout(this.detonate.bind(this), lifespan);
    }

    onDestroy() {
        clearTimeout(this.detonateTimeout);

        super.onDestroy();
    }

    modHitPoints() {}

    modDirection() {}

    addStatusEffect() {}

    detonate() {
        explosion({
            range: 3,
            row: this.row,
            col: this.col,
            board: this.board,
            source: this.source,
        });

        this.destroy();
    }
}
module.exports = Bomb;
