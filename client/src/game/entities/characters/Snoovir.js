import Mob from "./Mob";

class Entity extends Mob {
    constructor(x, y, config) {
        config.displayName = "Snoovir";
        super(x, y, config);
    }
}

Entity.prototype.animationSetName = "snoovir";

export default Entity;
