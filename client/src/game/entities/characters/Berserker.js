import Mob from "./Mob";

class Entity extends Mob {
    constructor(x, y, config) {
        config.displayName = "Berserker";
        super(x, y, config);
    }
}

Entity.prototype.animationSetName = "berserker";

export default Entity;
