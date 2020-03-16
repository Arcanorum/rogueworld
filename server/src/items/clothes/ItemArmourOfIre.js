
const Clothes = require('./Clothes');

class ItemArmourOfIre extends Clothes {

    modDurability(){
        // Overwrite this with nothing so it doesn't lose durability.
        // TODO: change this to be propery check based on Item proto.
    }

    damage (amount, source) {
        super.damage(amount, source);
    }

    onDamaged (amount, source) {
        // Check the entity can be damaged.
        if(source && source.damage){
            // Only damage the source if this player has glory.
            if(this.owner.glory > Math.abs(amount)){
                this.owner.modGlory(amount);
                source.damage(amount, this.owner);
            }
        }

        super.onDamaged(amount, source);
    }
}
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemArmourOfIre;

const StatNames = require('./../../stats/Statset').prototype.StatNames;
//const damage = new require('../../Damage')({amount: 0});

ItemArmourOfIre.prototype.registerItemType();
ItemArmourOfIre.prototype.idName = "Dungium armour";
ItemArmourOfIre.prototype.PickupType = require('../../entities/destroyables/pickups/PickupArmourOfIre');
ItemArmourOfIre.prototype.iconSource = "icon-dungium-armour";
ItemArmourOfIre.prototype.useGloryCost = 10;
ItemArmourOfIre.prototype.category = Clothes.prototype.categories.Clothing;
ItemArmourOfIre.prototype.defenceBonus = 0.50;
ItemArmourOfIre.prototype.statBonuses = {
    [StatNames.Melee]: 2
};