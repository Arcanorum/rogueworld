import Mob from "./Mob";

class Entity extends Mob {
    constructor(x, y, config) {
        config.displayName = "Mage";
        super(x, y, config);
    }
}

Entity.prototype.animationSetName = "mage";

export default Entity;
