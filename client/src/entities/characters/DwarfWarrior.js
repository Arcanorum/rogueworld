import Character from "./Character";

class Entity extends Character {
    constructor(x, y, config){
        super(x, y, config);

        this.displayName.setText(dungeonz.getTextDef("Mob name: Dwarf warrior"));
    }
}

Entity.prototype.animationSetName = "dwarf-warrior";

export default Entity;