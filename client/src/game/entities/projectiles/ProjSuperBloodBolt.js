import gameConfig from "../../../shared/GameConfig";
import Projectile from "./Projectile";

class Entity extends Projectile {
    constructor(x, y, config) {
        super(x, y, config, "proj-blood-bolt");
        this.setScale(gameConfig.GAME_SCALE * 1.2);
        this.alpha = 0.9;
    }
}

Entity.prototype.directionAngleSet = Projectile.prototype.CardinalDirectionAngles;

export default Entity;
