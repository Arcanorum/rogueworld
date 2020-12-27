import Mob from "./Mob";

class Entity extends Mob {
    constructor(x, y, config) {
        config.displayName = "Knight";
        super(x, y, config);
    }
}

Entity.prototype.animationSetName = "knight";

export default Entity;
