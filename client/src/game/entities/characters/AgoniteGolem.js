import Mob from "./Mob";

class Entity extends Mob {
    constructor(x, y, config) {
        config.displayName = "Agonite golem";
        super(x, y, config);
    }
}

Entity.prototype.animationSetName = "agonite-golem";

export default Entity;
