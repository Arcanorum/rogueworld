import Character from "./Character";

class Entity extends Character {
    constructor(x, y, config) {
        super(x, y, config);

        this.displayName.setText(dungeonz.getTextDef("Mob name: Bat"));
        this.baseSprite.anims.play(`${this.animationSetName}-${this.direction}`);
    }
}

Entity.prototype.animationSetName = "bat";
Entity.prototype.animationFrameSequence = [1, 2, 3];
Entity.prototype.animationRepeats = true;

export default Entity;