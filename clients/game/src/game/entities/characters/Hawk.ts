import Mob from './Mob';

class Entity extends Mob {
    constructor(x: number, y: number, config: any) {
        // config.displayName = "Hawk";
        super(x, y, config);

        // this.baseSprite.anims.play(`${this.animationSetName}-${this.direction}`);
    }
}

// Entity.prototype.animationSetName = "hawk";
// Entity.prototype.animationRepeats = true;
// Entity.prototype.animationDuration = 1000;

export default Entity;
