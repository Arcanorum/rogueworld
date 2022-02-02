import Config from '../../../shared/Config';
import Global from '../../../shared/Global';
import Projectile from './Projectile';

class Entity extends Projectile {
    constructor(x: number, y: number, config: any) {
        super(x, y, config, 'proj-fireball');
        this.setScale(Config.GAME_SCALE * 1.2);
        this.alpha = 0.9;
    }

    onMove() {
        dungeonz.gameScene.tilemap.updateDarknessGrid();
    }
}

Entity.prototype.lightDistance = 6;
Entity.prototype.directionAngleSet = Projectile.prototype.CardinalDirectionAngles;

export default Entity;
