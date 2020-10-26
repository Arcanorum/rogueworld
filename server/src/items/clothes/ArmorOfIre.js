const Clothes = require("./Clothes");
const StatNames = require("../../stats/Statset").prototype.StatNames;

class ArmorOfIre extends Clothes {

    modDurability(){
        // Overwrite this with nothing so it doesn't lose durability.
    }

    onDamaged (damage, source) {
        // Check the entity can be damaged.
        if(source.damage){
            // Only damage the source if this player has glory.
            if(this.owner.glory > Math.abs(damage.amount)){
                this.owner.modGlory(-damage.amount);
                source.damage(damage, this.owner);
            }
        }

        super.onDamaged(damage, source);
    }
}

ArmorOfIre.prototype.translationID = "Dungium armour";
ArmorOfIre.prototype.iconSource = "icon-dungium-armour";
ArmorOfIre.prototype.useGloryCost = 12;
ArmorOfIre.prototype.category = Clothes.prototype.categories.Clothing;
ArmorOfIre.prototype.defenceBonus = 100;
ArmorOfIre.prototype.statBonuses = {
    [StatNames.Melee]: 2
};

module.exports = ArmorOfIre;