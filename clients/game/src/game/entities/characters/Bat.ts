import Mob from './Mob';

class Entity extends Mob {
    constructor(x: number, y: number, config: any) {
        // config.displayName = "Bat";
        super(x, y, config);

        // this.baseSprite.anims.play(`${this.animationSetName}-${this.direction}`);
    }
}

// Entity.prototype.animationSetName = "bat";
// Entity.prototype.animationFrameSequence = [1, 2, 3];
Entity.prototype.animationRepeats = true;

export default Entity;
