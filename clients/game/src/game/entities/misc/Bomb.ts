import Config from '../../../shared/Config';
import Sprite from '../Sprite';

class Entity extends Sprite {
    constructor(x: number, y: number, config: any) {
        super(x, y, config, 'bomb');

        this.setScale(Config.GAME_SCALE * 0.8);
    }
}

export default Entity;
