import Boss from "./Boss";

class Entity extends Boss {
    constructor(x, y, config) {
        config.displayName = "Arch mage";
        super(x, y, config);
    }
}

Entity.prototype.animationSetName = "mage";

export default Entity;
