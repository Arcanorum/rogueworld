import Mob from "./Mob";

class Entity extends Mob {
    constructor(x: number, y: number, config: any) {
        config.displayName = "Assassin";
        super(x, y, config);
    }
}

Entity.prototype.animationSetName = "assassin";

export default Entity;
