import Merchant from "./Merchant";
import NPCShopTypes from "../../catalogues/NPCShopTypes.json";

class Entity extends Merchant {
    constructor(x, y, config) {
        super(x, y, config);

        this.displayName.setText(dungeonz.getTextDef("Mob name: Magic merchant"));
        this.npcShopType = NPCShopTypes.Magic;
    }
}

export default Entity;