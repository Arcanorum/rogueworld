import Merchant from "./Merchant";
import NPCShopTypes from "../../../catalogues/NPCShopTypes.json";

class Entity extends Merchant {
    constructor(x, y, config) {
        config.displayName = "Innkeeper";
        super(x, y, config);

        this.npcShopType = NPCShopTypes.Inn;
    }
}

export default Entity;
