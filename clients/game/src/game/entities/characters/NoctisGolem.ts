import Mob from './Mob';

class Entity extends Mob {
    constructor(x: number, y: number, config: any) {
        config.displayName = 'Noctis golem';
        super(x, y, config);
    }
}

Entity.prototype.animationSetName = 'noctis-golem';

export default Entity;
