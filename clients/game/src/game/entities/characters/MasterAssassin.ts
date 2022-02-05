import Boss from './Boss';

class Entity extends Boss {
    constructor(x: number, y: number, config: any) {
        config.displayName = 'Master assassin';
        super(x, y, config);
    }
}

Entity.prototype.animationSetName = 'assassin';

export default Entity;
