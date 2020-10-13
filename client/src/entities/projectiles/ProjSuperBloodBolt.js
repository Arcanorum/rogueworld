import Projectile from "./Projectile";

class Entity extends Projectile {
    constructor(x, y, config) {
        super(x, y, config, "proj-blood-bolt");
        this.setScale(GAME_SCALE * 1.2);
        this.angle = this.CardinalDirectionAngles[config.direction] || this.CardinalDirectionAngles.l;
        this.alpha = 0.9;
    }
};

export default Entity;