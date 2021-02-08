import Utils from "../../../shared/Utils";
import Character from "./Character";

class Mob extends Character {
    constructor(x, y, config) {
        config.displayName = Utils.getTextDef(`Mob name: ${config.displayName}`);
        super(x, y, config);
    }
}

export default Mob;
