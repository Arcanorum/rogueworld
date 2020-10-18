import Boss from "./Boss";

class Entity extends Boss {
    constructor(x, y, config){
        super(x, y, config);

        this.displayName.setText(dungeonz.getTextDef("Mob name: Master assassin"));
    }
}

Entity.prototype.animationSetName = "assassin";

export default Entity;