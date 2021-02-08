import Phaser from "phaser";

/**
 * A wrapper around the core Phaser sprite, for some common things that might be used by any entity sprites.
 * Avoids having to modify the Phaser sprite prototype.
 */
class Sprite extends Phaser.GameObjects.Sprite {
    constructor(x, y, config, frame) {
        super(window.gameScene, x, y, "game-atlas", frame);
        window.gameScene.add.existing(this);
    }

    /**
     * TODO: whats this for???
     */
    onChangeDirection() {}
}

export default Sprite;
