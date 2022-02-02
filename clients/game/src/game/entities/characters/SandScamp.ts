import Mob from './Mob';

class Entity extends Mob {
    constructor(x: number, y: number, config: any) {
        config.displayName = 'Sand scamp';
        super(x, y, config);

        this.baseSprite.setScale(0.8);
    }
}

Entity.prototype.animationSetName = 'sand-scamp';

export default Entity;
