import Projectile from "./Projectile";

class Entity extends Projectile {
    constructor(x, y, config) {
        super(x, y, config, "proj-wind");
        this.angle = this.CardinalDirectionAngles[config.direction] || this.CardinalDirectionAngles.l;
        this.alpha = 0.5;
    }
};

export default Entity;