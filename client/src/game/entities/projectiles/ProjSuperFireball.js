import gameConfig from "../../../shared/GameConfig";
import dungeonz from "../../../shared/Global";
import Projectile from "./Projectile";

class Entity extends Projectile {
    constructor(x, y, config) {
        super(x, y, config, "proj-fireball");
        this.setScale(gameConfig.GAME_SCALE * 1.2);
        this.alpha = 0.9;
    }

    onMove() {
        dungeonz.gameScene.tilemap.updateDarknessGrid();
    }
}

Entity.prototype.lightDistance = 6;
Entity.prototype.directionAngleSet = Projectile.prototype.CardinalDirectionAngles;

export default Entity;
