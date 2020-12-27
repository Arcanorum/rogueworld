import gameConfig from "../../../shared/GameConfig";
import Sprite from "../Sprite";

class Entity extends Sprite {
    constructor(x, y, config) {
        config.frame = "corpse-human";
        super(x, y, config);

        this.setScale(gameConfig.GAME_SCALE);
    }
}

export default Entity;
