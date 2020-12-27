import Merchant from "./Merchant";
import NPCShopTypes from "../../../catalogues/NPCShopTypes.json";

class Entity extends Merchant {
    constructor(x, y, config) {
        config.displayName = "Tool merchant";
        super(x, y, config);

        this.npcShopType = NPCShopTypes.Tools;
    }
}

export default Entity;
