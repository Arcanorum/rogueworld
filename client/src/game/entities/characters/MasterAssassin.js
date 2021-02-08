import Boss from "./Boss";

class Entity extends Boss {
    constructor(x, y, config) {
        config.displayName = "Master assassin";
        super(x, y, config);
    }
}

Entity.prototype.animationSetName = "assassin";

export default Entity;
