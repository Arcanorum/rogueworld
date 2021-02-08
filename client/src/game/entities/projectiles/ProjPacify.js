import Projectile from "./Projectile";

class Entity extends Projectile {
    constructor(x, y, config) {
        super(x, y, config, "proj-pacify");
        this.alpha = 0.9;
    }
}

Entity.prototype.directionAngleSet = Projectile.prototype.CardinalDirectionAngles;

export default Entity;
