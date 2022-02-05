import Mob from './Mob';

class Entity extends Mob {
    constructor(x: number, y: number, config: any) {
        config.displayName = 'Blood priest';
        super(x, y, config);
    }
}

Entity.prototype.animationSetName = 'blood-priest';

export default Entity;
