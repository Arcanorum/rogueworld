import Boss from "./Boss";

class Entity extends Boss {
    constructor(x: number, y: number, config: any) {
        config.displayName = "Great gnarl";
        super(x, y, config);
    }
}

Entity.prototype.animationSetName = "gnarl-pine";

export default Entity;
