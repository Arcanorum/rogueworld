import Config from '../../../shared/Config';
import Projectile from './Projectile';

class Entity extends Projectile {
    constructor(x: number, y: number, config: any) {
        super(x, y, config, 'proj-ill-omen');
        this.setScale(Config.GAME_SCALE * 0.8);
    }
}

Entity.prototype.directionAngleSet = Projectile.prototype.CardinalDirectionAngles;

export default Entity;
