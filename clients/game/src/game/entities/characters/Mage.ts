import Mob from './Mob';

class Entity extends Mob {
    constructor(x: number, y: number, config: any) {
        config.displayName = 'Mage';
        super(x, y, config);
    }
}

// Entity.prototype.animationSetName = 'mage';

export default Entity;
