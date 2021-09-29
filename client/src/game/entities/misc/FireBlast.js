import gameConfig from "../../../shared/GameConfig";
import Sprite from "../Sprite";

class Entity extends Sprite {
    constructor(x, y, config) {
        super(x, y, config, "fire-blast");

        this.setScale(gameConfig.GAME_SCALE);
    }
}

export default Entity;
