import Mob from "./Mob";

class Entity extends Mob {
    constructor(x, y, config) {
        config.displayName = "Prisoner";
        super(x, y, config);
    }
}

Entity.prototype.animationSetName = "prisoner";

export default Entity;
