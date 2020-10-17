import Character from "./Character";
import Clothes from "./Clothes";

class Entity extends Character {
    constructor(x, y, config){
        super(x, y, config);

        // Give this player a clothes object.
        // Whenever the clothes change, it is just changing the frame name used of this one display object.
        this.clothes = new Clothes(config);
        this.add(this.clothes);
        // Bring the display name over the clothes, so the clothes don't cover it.
        // v TODO figure out what this would be in P3
        //this.swapChildren(this.clothes, this.displayName);
        
        // TODO: add a chat bubble above head when someone starts chatting.


    }

    onMove (playMoveAnim) {
        if (playMoveAnim === true) {
            this.clothes.anims.play(this.clothes.clothesName + "-" + this.direction);
        }
        super.onMove(playMoveAnim);
    };

};

Entity.animationBaseName = "human";

Entity.prototype.baseFrames = {
    up: 'human-up-1',
    down: 'human-down-1',
    left: 'human-left-1',
    right: 'human-right-1'
};

export default Entity;