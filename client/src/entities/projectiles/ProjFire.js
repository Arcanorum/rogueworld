import Projectile from "./Projectile";

class Entity extends Projectile {
    constructor(x, y, config) {
        super(x, y, config, "proj-fire");
        this.angle = this.CardinalDirectionAngles[config.direction] || this.CardinalDirectionAngles.l;
        this.alpha = 0.9;
    }

    onMove() {
        _this.tilemap.updateDarknessGrid();
    }
};

Entity.prototype.lightDistance = 5;

export default Entity;