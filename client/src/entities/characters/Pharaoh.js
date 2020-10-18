import Boss from "./Boss";

class Entity extends Boss {
    constructor(x, y, config){
        super(x, y, config);
  
        this.displayName.setText(dungeonz.getTextDef("Mob name: Pharaoh"));
    }
}

Entity.prototype.animationSetName = "pharaoh";

export default Entity;