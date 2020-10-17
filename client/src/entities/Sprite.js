/**
 * A wrapper around the core Phaser sprite, for some common things that might be used by any entity sprites.
 * Avoids having to modify the Phaser sprite prototype.
 */
class Sprite extends Phaser.GameObjects.Sprite {
    /**
     * Starts this sprite doing a bobbing in-out effect, mostly for pickups.
     */
    tweenPickupFromCenter() {
        this.setOrigin(0.5);
        this.x += dungeonz.CENTER_OFFSET;
        this.y += dungeonz.CENTER_OFFSET;
        // When does this end? does it loop forever on nothing when pickup is removed? double check...
        // _this.add.tween(this.scale).to({ x: this.scale.x * 0.8, y: this.scale.y * 0.8 }, 1000, "Linear", true, 0, -1, true);
    }

    /**
     * TODO: whats this for???
     */
    onChangeDirection() {
    }

}

export default Sprite;