import Mob from "./Mob";

class Entity extends Mob {
    constructor(x, y, config) {
        config.displayName = "Gnarl";
        super(x, y, config);
    }
}

Entity.prototype.animationSetName = "gnarl-oak";
Entity.prototype.animationFrameSequence = [1, 2];

export default Entity;
