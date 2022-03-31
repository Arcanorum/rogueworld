import Mob from './Mob';

class Entity extends Mob {
    constructor(x: number, y: number, config: any) {
        config.displayName = 'Dungium golem';
        super(x, y, config);
    }
}

// Entity.prototype.animationSetName = 'dungium-golem';

export default Entity;
