
const Clothes = require('./Clothes');

class ItemArmorOfIre extends Clothes {

    modDurability(){
        // Overwrite this with nothing so it doesn't lose durability.
        // TODO: change this to be propery check based on Item proto.
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
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemArmorOfIre;

const StatNames = require('../../stats/Statset').prototype.StatNames;

ItemArmorOfIre.prototype.registerItemType();
ItemArmorOfIre.prototype.idName = "Dungium armour";
ItemArmorOfIre.prototype.PickupType = require('../../entities/destroyables/pickups/PickupArmorOfIre');
ItemArmorOfIre.prototype.iconSource = "icon-dungium-armour";
ItemArmorOfIre.prototype.useGloryCost = 12;
ItemArmorOfIre.prototype.category = Clothes.prototype.categories.Clothing;
ItemArmorOfIre.prototype.defenceBonus = 100;
ItemArmorOfIre.prototype.statBonuses = {
    [StatNames.Melee]: 2
};