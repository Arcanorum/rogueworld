import Merchant from "./Merchant";
import NPCShopTypes from "./../../catalogues/NPCShopTypes.json";

class Entity extends Merchant {
    constructor(x, y, config) {
        super(x, y, config);

        this.displayName.setText(dungeonz.getTextDef("Mob name: Omni merchant"));
        this.npcShopType = NPCShopTypes.Omni;
    }
}

export default Entity;