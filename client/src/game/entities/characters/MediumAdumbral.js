import Mob from "./Mob";

class Entity extends Mob {
    constructor(x, y, config) {
        config.displayName = "Adumbral";
        super(x, y, config);
    }
}

Entity.prototype.animationSetName = "adumbral-medium";

export default Entity;
