import Boss from "./Boss";

class Entity extends Boss {
    constructor(x, y, config) {
        super(x, y, config);

        this.displayName.setText(dungeonz.getTextDef("Mob name: Arch mage"));
    }
}

Entity.prototype.animationSetName = "mage";

export default Entity;