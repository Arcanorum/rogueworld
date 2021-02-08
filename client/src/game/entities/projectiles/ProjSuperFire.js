import gameConfig from "../../../shared/GameConfig";
import Projectile from "./Projectile";

class Entity extends Projectile {
    constructor(x, y, config) {
        super(x, y, config, "proj-fire");
        this.setScale(gameConfig.GAME_SCALE * 1.2);
        this.alpha = 0.9;
    }

    onMove() {
        window.gameScene.tilemap.updateDarknessGrid();
    }
}

Entity.prototype.lightDistance = 6;
Entity.prototype.directionAngleSet = Projectile.prototype.CardinalDirectionAngles;

export default Entity;
