import Projectile from "./Projectile";

class Entity extends Projectile {
    constructor(x, y, config) {
        super(x, y, config, "proj-fire");
        this.setScale(GAME_SCALE * 1.2);
        this.angle = this.CardinalDirectionAngles[config.direction] || this.CardinalDirectionAngles.l;
        this.alpha = 0.9;
    }

    onMove() {
        _this.tilemap.updateDarknessGrid();
    }
};

Entity.prototype.lightDistance = 6;

export default Entity;