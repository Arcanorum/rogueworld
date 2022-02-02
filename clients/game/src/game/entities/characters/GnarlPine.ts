import Mob from "./Mob";

class Entity extends Mob {
    constructor(x: number, y: number, config: any) {
        config.displayName = "Gnarl";
        super(x, y, config);
    }
}

Entity.prototype.animationSetName = "gnarl-pine";
Entity.prototype.animationFrameSequence = [1, 2];

export default Entity;
