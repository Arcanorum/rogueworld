import Character from "./Character";
import Clothes from "./Clothes";

class Entity extends Character {
    constructor(x, y, config) {
        super(x, y, config);

        // Give this player a clothes object.
        // Whenever the clothes change, it is just changing the frame name used of this one display object.
        this.clothes = new Clothes(config);
        this.add(this.clothes);
        // Bring the display name and damage/heal marker over the clothes, so the clothes don't cover them.
        this.bringToTop(this.displayName);
        this.bringToTop(this.damageMarker);

        // TODO: add a chat bubble above head when someone starts chatting.

    }

    onMove(playMoveAnim) {
        if (playMoveAnim === true) {
            this.clothes.anims.play(this.clothes.clothesName + "-" + this.direction);
        }
        super.onMove(playMoveAnim);
    }
}

Entity.prototype.animationSetName = "human";

export default Entity;