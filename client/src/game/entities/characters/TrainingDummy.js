import Mob from "./Mob";

class Entity extends Mob {
    constructor(x, y, config) {
        config.displayName = "Training dummy";
        super(x, y, config);
    }
}

Entity.prototype.baseFrames = { down: "training-dummy" };

export default Entity;
