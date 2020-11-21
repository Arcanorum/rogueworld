import Character from "./Character";

class Entity extends Character {
    constructor(x, y, config) {
        super(x, y, config);

        this.displayName.setText(dungeonz.getTextDef("Mob name: Rat"));
        this.baseSprite.setScale(0.5);
    }
}

Entity.prototype.animationSetName = "rat";
Entity.prototype.animationRepeats = true;

export default Entity;