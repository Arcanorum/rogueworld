import Boss from "./Boss";

class Entity extends Boss {
    constructor(x, y, config){
        super(x, y, config);
        
        this.displayName.setText(dungeonz.getTextDef("Mob name: Blood lord"));
    }
}

Entity.prototype.animationSetName = "blood-lord";

export default Entity;