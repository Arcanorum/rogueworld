import Projectile from "./Projectile";

class Entity extends Projectile {
    constructor(x, y, config) {
        super(x, y, config, "proj-vampire-fang");
        this.angle = this.DiagonalDirectionAngles[config.direction] || this.DiagonalDirectionAngles.l;
    }
};

export default Entity;