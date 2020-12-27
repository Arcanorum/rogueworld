import Boss from "./Boss";

class Entity extends Boss {
    constructor(x, y, config) {
        config.displayName = "Blood lord";
        super(x, y, config);
    }
}

Entity.prototype.animationSetName = "blood-lord";

export default Entity;
