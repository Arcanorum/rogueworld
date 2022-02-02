import Boss from './Boss';

class Entity extends Boss {
    constructor(x: number, y: number, config: any) {
        config.displayName = 'Bandit leader';
        super(x, y, config);
    }
}

Entity.prototype.animationSetName = 'bandit';

export default Entity;
