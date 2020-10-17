import Trader from './Trader';
import NPCShopTypes from "./../../catalogues/NPCShopTypes.json";

class Entity extends Trader {
    constructor(x, y, config) {
        super(x, y, config);

        this.displayName.setText(dungeonz.getTextDef("Mob name: Magic merchant"));
        this.npcShopType = NPCShopTypes.Magic;
    }
}

export default Entity;