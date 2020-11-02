import Sprite from "../Sprite";

class Pickup extends Sprite {
    constructor(x, y, config) {
        super(x, y, config);

        this.setFrame(this.frameName);
        this.setScale(GAME_SCALE * (this.scaleModifier || 1));
        this.tweenPickupFromCenter();
    }

    /**
     * Starts this sprite doing a bobbing in-out effect, mostly for pickups.
     */
    tweenPickupFromCenter() {
        // this.setOrigin(0.5);
        // this.x += dungeonz.CENTER_OFFSET;
        // this.y += dungeonz.CENTER_OFFSET;
        // When does this end? does it loop forever on nothing when pickup is removed? double check...
        // _this.add.tween(this.scale).to({ x: this.scale.x * 0.8, y: this.scale.y * 0.8 }, 1000, "Linear", true, 0, -1, true);
    }
}

Pickup.prototype.frameName = null;
Pickup.prototype.scaleModifier = null;

export default Pickup;