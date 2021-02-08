import Mob from "./Mob";

class Entity extends Mob {
    constructor(x, y, config) {
        config.displayName = "Vampire";
        super(x, y, config);
    }
}

Entity.prototype.animationSetName = "vampire";

export default Entity;
