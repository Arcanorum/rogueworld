import Merchant from "./Merchant";
import NPCShopTypes from "../../../catalogues/NPCShopTypes.json";

class Entity extends Merchant {
    constructor(x, y, config) {
        config.displayName = "Arena master";
        super(x, y, config);

        this.npcShopType = NPCShopTypes.Arena;
    }
}

export default Entity;
