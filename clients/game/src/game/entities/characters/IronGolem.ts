import Mob from './Mob';

class Entity extends Mob {
    constructor(x: number, y: number, config: any) {
        config.displayName = 'Iron golem';
        super(x, y, config);
    }
}

Entity.prototype.animationSetName = 'iron-golem';

export default Entity;
