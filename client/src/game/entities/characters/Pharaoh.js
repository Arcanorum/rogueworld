import Boss from "./Boss";

class Entity extends Boss {
    constructor(x, y, config) {
        config.displayName = "Pharaoh";
        super(x, y, config);
    }
}

Entity.prototype.animationSetName = "pharaoh";

export default Entity;
