import Mob from './Mob';

class Entity extends Mob {
    constructor(x: number, y: number, config: any) {
        config.displayName = 'Zombie';
        super(x, y, config);
    }
}

Entity.prototype.animationSetName = 'human-zombie';

export default Entity;
