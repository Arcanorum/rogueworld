import Mob from './Mob';

class Entity extends Mob {
    constructor(x: number, y: number, config: any) {
        config.displayName = 'Agonite golem';
        super(x, y, config);
    }
}

// Entity.prototype.animationSetName = 'agonite-golem';

export default Entity;
