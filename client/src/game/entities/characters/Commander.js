import Boss from "./Boss";

class Entity extends Boss {
    constructor(x, y, config) {
        config.displayName = "Commander";
        super(x, y, config);
    }
}

Entity.prototype.animationSetName = "knight";

export default Entity;
