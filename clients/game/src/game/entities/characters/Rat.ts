import Mob from './Mob';

class Entity extends Mob {
    constructor(x: number, y: number, config: any) {
        config.displayName = 'Rat';
        super(x, y, config);

        this.baseSprite.setScale(0.5);
        this.baseSprite.anims.play(`${this.animationSetName}-${this.direction}`);
    }
}

Entity.prototype.animationSetName = 'rat';
Entity.prototype.animationRepeats = true;
Entity.prototype.animationDuration = 1000;

export default Entity;
