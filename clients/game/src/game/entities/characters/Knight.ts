import Mob from "./Mob";

class Entity extends Mob {
    constructor(x: number, y: number, config: any) {
        config.displayName = "Knight";
        super(x, y, config);
    }
}

Entity.prototype.animationSetName = "knight";

export default Entity;
