import Mob from './Mob';

class Entity extends Mob {
    constructor(x: number, y: number, config: any) {
        config.displayName = 'Warrior';
        super(x, y, config);
    }
}

Entity.prototype.animationSetName = 'warrior';

export default Entity;
