import Boss from "./Boss";

class Entity extends Boss {
    constructor(x, y, config) {
        config.displayName = "Bandit leader";
        super(x, y, config);
    }
}

Entity.prototype.animationSetName = "bandit";

export default Entity;
