import Mob from "./Mob";

class Entity extends Mob {
    constructor(x, y, config) {
        config.displayName = "Dwarf warrior";
        super(x, y, config);
    }
}

Entity.prototype.animationSetName = "dwarf-warrior";

export default Entity;
