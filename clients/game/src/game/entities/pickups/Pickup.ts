import Config from '../../../shared/Config';
import Global from '../../../shared/Global';
import Sprite from '../Sprite';

class Pickup extends Sprite {
    frameName!: string;

    scaleModifier!: number;

    constructor(x: number, y: number, config: object) {
        // -1 on Y to move it up slightly, so it appears behind the player when stood on after
        // being sorted in the dynamics container.
        super(x, y - 1, config);

        this.setFrame(this.frameName);
        this.setScale(Config.GAME_SCALE * (this.scaleModifier || 1));
        this.setOrigin(0.5);

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

Pickup.prototype.frameName = '';
Pickup.prototype.scaleModifier = 0;

export default Pickup;
