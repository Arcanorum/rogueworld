import Mob from "./Mob";

class Entity extends Mob {
    constructor(x: number, y: number, config: any) {
        config.displayName = "Dwarf";
        super(x, y, config);
    }
}

Entity.prototype.animationSetName = "dwarf";

export default Entity;
