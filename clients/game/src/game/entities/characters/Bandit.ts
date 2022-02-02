import Mob from "./Mob";

class Entity extends Mob {
    constructor(x: number, y: number, config: any) {
        config.displayName = "Bandit";
        super(x, y, config);
    }
}

Entity.prototype.animationSetName = "bandit";

export default Entity;
