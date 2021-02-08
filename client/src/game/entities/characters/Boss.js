import Mob from "./Mob";

class Boss extends Mob {
    constructor(x, y, config) {
        super(x, y, config);

        this.displayName.setColor("#ff6b00");
        this.baseSprite.setScale(1.2);
    }
}

export default Boss;
