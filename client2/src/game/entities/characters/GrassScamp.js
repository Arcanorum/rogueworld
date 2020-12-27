import Mob from "./Mob";

class Entity extends Mob {
    constructor(x, y, config) {
        config.displayName = "Grass scamp";
        super(x, y, config);

        this.baseSprite.setScale(0.8);
    }
}

Entity.prototype.animationSetName = "grass-scamp";

export default Entity;
