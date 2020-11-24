import Character from "./Character";

class Entity extends Character {
    constructor(x, y, config) {
        super(x, y, config);

        this.displayName.setText(dungeonz.getTextDef("Mob name: Hawk"));
        this.baseSprite.anims.play(`${this.animationSetName}-${this.direction}`);
    }
}

Entity.prototype.animationSetName = "hawk";
Entity.prototype.animationRepeats = true;
Entity.prototype.animationDuration = 1000;

export default Entity;