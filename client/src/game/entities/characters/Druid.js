import Mob from "./Mob";

class Entity extends Mob {
    constructor(x, y, config) {
        config.displayName = "Druid";
        super(x, y, config);
    }
}

Entity.prototype.animationSetName = "druid";

export default Entity;
