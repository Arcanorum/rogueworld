import Trader from './Trader';
import NPCShopTypes from "./../../catalogues/NPCShopTypes.json";

class Entity extends Trader {
    constructor(x, y, config) {
        super(x, y, config);

        this.displayName.setText(dungeonz.getTextDef("Mob name: Ruler"));
        this.npcShopType = NPCShopTypes.Ruler;
    }
}

export default Entity;