import gameConfig from "../../../shared/GameConfig";
import Projectile from "./Projectile";

class Entity extends Projectile {
    constructor(x, y, config) {
        super(x, y, config, "proj-acorn");
        this.setScale(gameConfig.GAME_SCALE * 0.6);
    }
}
Entity.prototype.spinDuration = 1000;

export default Entity;
