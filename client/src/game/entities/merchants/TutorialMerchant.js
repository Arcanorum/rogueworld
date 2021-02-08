import Merchant from "./Merchant";
import NPCShopTypes from "../../../catalogues/NPCShopTypes.json";

class Entity extends Merchant {
    constructor(x, y, config) {
        config.displayName = "Merchant";
        super(x, y, config);

        this.baseSprite.setFrame("tutorial-trader-basic-1");
        this.npcShopType = NPCShopTypes.Tutorial;
    }
}

export default Entity;
