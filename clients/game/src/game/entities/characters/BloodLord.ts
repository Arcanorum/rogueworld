import Boss from './Boss';

class Entity extends Boss {
    constructor(x: number, y: number, config: any) {
        config.displayName = 'Blood lord';
        super(x, y, config);
    }
}

// Entity.prototype.animationSetName = 'blood-lord';

export default Entity;
