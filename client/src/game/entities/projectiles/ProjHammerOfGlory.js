import gameConfig from "../../../shared/GameConfig";
import Projectile from "./Projectile";

class Entity extends Projectile {
    constructor(x, y, config) {
        super(x, y, config, "proj-hammer-of-glory");
        this.setScale(gameConfig.GAME_SCALE * 1.2);
    }
}

export default Entity;
