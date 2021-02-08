import Projectile from "./Projectile";

class Entity extends Projectile {
    constructor(x, y, config) {
        super(x, y, config, "proj-wind");
        this.alpha = 0.5;
    }
}

Entity.prototype.directionAngleSet = Projectile.prototype.CardinalDirectionAngles;

export default Entity;
