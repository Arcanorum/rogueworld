const Item = require("./Item");
const Cured = require("../gameplay/StatusEffects").Cured;

class CurePotion extends Item {

    onUsed () {
        this.owner.addStatusEffect(Cured);

        super.onUsed();
    }

}

CurePotion.translationID = "Cure potion";
CurePotion.iconSource = "icon-cure-potion";
CurePotion.soundType = "Drink";
CurePotion.prototype.craftingExpValue = 40;
CurePotion.prototype.baseDurability = 6;
CurePotion.prototype.useDurabilityCost = 1;

module.exports = CurePotion;