import Mob from "./Mob";

class Entity extends Mob {
    constructor(x, y, config) {
        config.displayName = "Blood priest";
        super(x, y, config);
    }
}

Entity.prototype.animationSetName = "blood-priest";

export default Entity;
