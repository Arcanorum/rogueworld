import gameConfig from "../../../shared/GameConfig";
import Sprite from "../Sprite";

class Entity extends Sprite {
    constructor(x, y, config) {
        super(x, y, config, "bomb");

        this.setScale(gameConfig.GAME_SCALE * 0.8);
    }
}

export default Entity;
