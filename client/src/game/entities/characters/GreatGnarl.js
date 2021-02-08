import Boss from "./Boss";

class Entity extends Boss {
    constructor(x, y, config) {
        config.displayName = "Great gnarl";
        super(x, y, config);
    }
}

Entity.prototype.animationSetName = "gnarl-oak";

export default Entity;
