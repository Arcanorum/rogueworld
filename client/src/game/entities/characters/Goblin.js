import Mob from "./Mob";

class Entity extends Mob {
    constructor(x, y, config) {
        config.displayName = "Goblin";
        super(x, y, config);

        this.baseSprite.setScale(0.8);
    }
}

Entity.prototype.animationSetName = "goblin";

export default Entity;
