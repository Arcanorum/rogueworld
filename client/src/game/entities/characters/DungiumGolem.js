import Mob from "./Mob";

class Entity extends Mob {
    constructor(x, y, config) {
        config.displayName = "Dungium golem";
        super(x, y, config);
    }
}

Entity.prototype.animationSetName = "dungium-golem";

export default Entity;
