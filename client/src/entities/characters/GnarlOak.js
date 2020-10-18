import Character from "./Character";

class Entity extends Character {
    constructor(x, y, config){
        super(x, y, config);

        this.displayName.setText(dungeonz.getTextDef("Mob name: Gnarl"));
    }
}

Entity.prototype.animationSetName = "gnarl-oak";
Entity.prototype.animationFrameSequence = [1, 2];

export default Entity;