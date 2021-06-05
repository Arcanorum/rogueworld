import Boss from "./Boss";

class Entity extends Boss {
    constructor(x, y, config) {
        config.displayName = "Elder";
        super(x, y, config);
    }
}

Entity.prototype.animationSetName = "druid";

export default Entity;
