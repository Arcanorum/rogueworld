import Character from "./Character";

class Entity extends Character {
    constructor(x, y, config){
        super(x, y, config);
        
        this.displayName.setText(dungeonz.getTextDef("Mob name: Blood lord"));
        this.displayName.addColor("#ff6b00", 0);
        this.baseSprite.setScale(1.2);
    }
}

Entity.prototype.animationSetName = "blood-lord";

export default Entity;