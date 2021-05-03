import Merchant from "./Merchant";
import NPCShopTypes from "../../../catalogues/NPCShopTypes.json";

class Entity extends Merchant {
    constructor(x, y, config) {
        config.displayName = "Priest";
        super(x, y, config);

        this.baseSprite.setFrame("trader-priest-1");
        this.npcShopType = NPCShopTypes.Priest;
    }
}

export default Entity;
