const Clothes = require("./Clothes");
const StatNames = require("../../stats/Statset").prototype.StatNames;

class Etherweave extends Clothes {

    modDurability(){
        // Overwrite this with nothing so it doesn't lose durability.
        // TODO: change this to be propery check based on Item proto.
    }

    onDamaged (amount, source) {
        // Check the entity can be damaged.
        if(source.damage){
            // Only give the player energy if they have glory.
            if(this.owner.glory > Math.abs(amount)){
                this.owner.modGlory(amount);
                // Give energy when damaged.
                this.owner.modEnergy(Math.abs(amount));
            }
        }

        super.onDamaged(amount, source);
    }

}

Etherweave.prototype.translationID = "Mage robe";
Etherweave.prototype.iconSource = "icon-mage-robe";
Etherweave.prototype.useGloryCost = 10;
Etherweave.prototype.category = Clothes.prototype.categories.Clothing;
Etherweave.prototype.defenceBonus = 20;
Etherweave.prototype.statBonuses = {
    [StatNames.Magic]: 2
};

module.exports = Etherweave;