import Mob from './Mob';

class Entity extends Mob {
    constructor(x: number, y: number, config: any) {
        config.displayName = 'Mummy';
        super(x, y, config);
    }
}

Entity.prototype.animationSetName = 'mummy';

export default Entity;
