import Merchant from "./Merchant";
import NPCShopTypes from "../../../catalogues/NPCShopTypes.json";

class Entity extends Merchant {
    constructor(x, y, config) {
        config.displayName = "Ranged merchant";
        super(x, y, config);

        this.npcShopType = NPCShopTypes.Ranged;
    }
}

export default Entity;
