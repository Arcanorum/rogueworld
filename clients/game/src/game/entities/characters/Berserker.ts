import Mob from './Mob';

class Entity extends Mob {
    constructor(x: number, y: number, config: any) {
        config.displayName = 'Berserker';
        super(x, y, config);
    }
}

// Entity.prototype.animationSetName = 'berserker';

export default Entity;
