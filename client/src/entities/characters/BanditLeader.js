import Boss from "./Boss";

class Entity extends Boss {
    constructor(x, y, config){
        super(x, y, config);
        
        this.displayName.setText(dungeonz.getTextDef("Mob name: Bandit leader"));
    }
}

Entity.prototype.animationSetName = "bandit";

export default Entity;