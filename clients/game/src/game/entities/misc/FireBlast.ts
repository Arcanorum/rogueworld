import Config from '../../../shared/Config';
import Sprite from '../Sprite';

class Entity extends Sprite {
    constructor(x: number, y: number, config: any) {
        super(x, y, config, 'fire-blast');

        this.setScale(Config.GAME_SCALE);
    }
}

export default Entity;
