import Projectile from './Projectile';

class Entity extends Projectile {
    constructor(x: number, y: number, config: any) {
        super(x, y, config, 'proj-pacify');
        this.alpha = 0.9;
    }
}

Entity.prototype.directionAngleSet = Projectile.prototype.CardinalDirectionAngles;

export default Entity;
