import Merchant from "./Merchant";
import NPCShopTypes from "./../../catalogues/NPCShopTypes.json";

class Entity extends Merchant {
    constructor(x, y, config) {
        super(x, y, config);

        this.displayName.setText(dungeonz.getTextDef("Mob name: Merchant"));
        this.baseSprite.setFrame("tutorial-merchant-basic-1");
        this.npcShopType = NPCShopTypes.Tutorial;
    }
}

export default Entity;