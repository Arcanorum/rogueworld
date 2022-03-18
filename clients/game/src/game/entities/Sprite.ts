import Phaser from 'phaser';
import Global from '../../shared/Global';

/**
 * A wrapper around the core Phaser sprite, for some common things that might be used by any entity sprites.
 * Avoids having to modify the Phaser sprite prototype.
 */
class Sprite extends Phaser.GameObjects.Sprite {
    static setupAnimations: () => void;

    static addAnimationSet: () => void;

    centered!: boolean;

    constructor(x: number, y: number, config: object, frame?: string) {
        super(Global.gameScene, x, y, 'game-atlas', frame);
        Global.gameScene.add.existing(this);
    }
}

Sprite.setupAnimations = () => { return; };

Sprite.addAnimationSet = () => { return; };

Sprite.prototype.centered = false;

export default Sprite;
