import Mob from './Mob';

class Entity extends Mob {
    constructor(x: number, y: number, config: any) {
        config.displayName = 'Training dummy';
        super(x, y, config);
    }
}

Entity.prototype.animationSetName = 'training-dummy';

export default Entity;
