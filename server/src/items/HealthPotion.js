const Item = require("./Item");
const HealthRegen = require("../gameplay/StatusEffects").HealthRegen;

class HealthPotion extends Item {

    onUsed () {
        // Don't waste a use on max HP.
        if(this.owner.hitPoints === this.owner.maxHitPoints) return;
        this.owner.addStatusEffect(HealthRegen);

        super.onUsed();
    }

}

HealthPotion.prototype.translationID = "Health potion";
HealthPotion.prototype.iconSource = "icon-health-potion";
HealthPotion.prototype.craftingExpValue = 20;
HealthPotion.prototype.baseDurability = 5;
HealthPotion.prototype.useDurabilityCost = 1;

module.exports = HealthPotion;