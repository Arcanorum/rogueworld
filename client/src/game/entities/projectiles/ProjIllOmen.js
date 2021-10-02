import gameConfig from "../../../shared/GameConfig";
import Projectile from "./Projectile";

class Entity extends Projectile {
    constructor(x, y, config) {
        super(x, y, config, "proj-ill-omen");
        this.setScale(gameConfig.GAME_SCALE * 0.8);
    }
}

Entity.prototype.directionAngleSet = Projectile.prototype.CardinalDirectionAngles;

export default Entity;
