import Boss from './Boss';

class Entity extends Boss {
    constructor(x: number, y: number, config: any) {
        config.displayName = 'Elder';
        super(x, y, config);
    }
}

// Entity.prototype.animationSetName = 'druid';

export default Entity;
