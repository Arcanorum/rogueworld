import Boss from "./Boss";

class Entity extends Boss {
    constructor(x, y, config){
        super(x, y, config);

        this.displayName.setText(dungeonz.getTextDef("Mob name: Great gnarl"));
    }
}

Entity.prototype.animationSetName = "gnarl-oak";

export default Entity;