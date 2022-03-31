import Mob from './Mob';

class Entity extends Mob {
    constructor(x: number, y: number, config: any) {
        config.displayName = 'Adumbral';
        super(x, y, config);
    }
}

// Entity.prototype.animationSetName = 'adumbral-small';

export default Entity;
