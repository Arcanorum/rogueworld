import Projectile from "./Projectile";

class Entity extends Projectile {
    constructor(x, y, config) {
        super(x, y, config, "proj-deathbind");
        this.angle = this.CardinalDirectionAngles[config.direction] || this.CardinalDirectionAngles.l;
        this.alpha = 0.9;
    }
};

export default Entity;