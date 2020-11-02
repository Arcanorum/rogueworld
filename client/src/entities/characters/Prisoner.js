import Character from "./Character";

class Entity extends Character {
    constructor(x, y, config){
        super(x, y, config);
   
        this.displayName.setText(dungeonz.getTextDef("Mob name: Prisoner"));
    }
}

Entity.prototype.animationSetName = "prisoner";

export default Entity;