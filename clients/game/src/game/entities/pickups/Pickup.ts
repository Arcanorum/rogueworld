import Global from '../../../shared/Global';
import Entity, { EntityConfig } from '../Entity';

class Pickup extends Entity {
    static frameName: string;

    static scaleModifier: number;

    static animationSetName = null;

    constructor(x: number, y: number, config: EntityConfig) {
        // -1 on Y to move it up slightly, so it appears behind the player when stood on after
        // being sorted in the dynamics container.
        super(x, y - 1, config);
        const PickupType = this.constructor as typeof Pickup;

        this.baseSprite.setFrame(PickupType.frameName);
        this.baseSprite.setScale(PickupType.scaleModifier || 1);
        this.baseSprite.setOrigin(0.5);

        // Starts this sprite doing a bobbing in-out effect.
        Global.gameScene.tweens.add({
            targets: this,
            duration: 1000,
            scale: this.scaleX * 0.8,
            ease: 'Linear',
            repeat: -1,
            yoyo: true,
        });
    }
}

export default Pickup;
