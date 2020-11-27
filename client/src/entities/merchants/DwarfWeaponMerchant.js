import Merchant from "./Merchant";
import NPCShopTypes from "./../../catalogues/NPCShopTypes.json";

class Entity extends Merchant {
    constructor(x, y, config) {
        super(x, y, config);

        this.displayName.setText(dungeonz.getTextDef("Mob name: Dwarf merchant"));
        this.baseSprite.setFrame("trader-dwarf-1");
        this.npcShopType = NPCShopTypes.DwarfWeapons;
    }

    static setupAnimations() {
        // merchant-dwarf-1
    }
}

export default Entity;