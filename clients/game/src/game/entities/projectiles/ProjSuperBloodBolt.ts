import Config from '../../../shared/Config';
import Projectile from './Projectile';

class Entity extends Projectile {
    constructor(x: number, y: number, config: any) {
        super(x, y, config, 'proj-blood-bolt');
        this.setScale(Config.GAME_SCALE * 1.2);
        this.alpha = 0.9;
    }
}

Entity.prototype.directionAngleSet = Projectile.prototype.CardinalDirectionAngles;

export default Entity;
