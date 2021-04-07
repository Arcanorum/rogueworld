const Destroyable = require("../Destroyable");

class Corpse extends Destroyable {
    constructor(config) {
        super(config);

        this.timeout = setTimeout(this.destroy.bind(this), 10000);
    }

    destroy() {
        clearTimeout(this.timeout);
        super.destroy();
    }
}

Corpse.abstract = true;

/**
 * The type of zombie character to create if this corpse is animated.
 * @type {Zombie}
 */
Corpse.prototype.ZombieType = null;

module.exports = Corpse;
