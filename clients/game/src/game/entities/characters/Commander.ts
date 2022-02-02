import Boss from "./Boss";

class Entity extends Boss {
    constructor(x: number, y: number, config: any) {
        config.displayName = "Commander";
        super(x, y, config);
    }
}

Entity.prototype.animationSetName = "knight";

export default Entity;
