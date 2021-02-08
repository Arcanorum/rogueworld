import Merchant from "./Merchant";
import NPCShopTypes from "../../../catalogues/NPCShopTypes.json";

class Entity extends Merchant {
    constructor(x, y, config) {
        config.displayName = "Magic merchant";
        super(x, y, config);

        this.npcShopType = NPCShopTypes.Magic;
    }
}

export default Entity;
