import Trader from './Trader';
import NPCShopTypes from "./../../catalogues/NPCShopTypes.json";

class Entity extends Trader {
    constructor(x, y, config) {
        super(x, y, config);

        this.displayName.setText(dungeonz.getTextDef("Mob name: Merchant"));
        this.baseSprite.setFrame("tutorial-trader-basic-1");
        this.npcShopType = NPCShopTypes.Tutorial;
    }
}

export default Entity;