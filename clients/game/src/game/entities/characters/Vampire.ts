import Mob from './Mob';

class Entity extends Mob {
    constructor(x: number, y: number, config: any) {
        config.displayName = 'Vampire';
        super(x, y, config);
    }
}

Entity.prototype.animationSetName = 'vampire';

export default Entity;
