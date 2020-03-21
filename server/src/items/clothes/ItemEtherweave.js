
const Clothes = require('./Clothes');

class ItemEtherweave extends Clothes {

    modDurability(){
        // Overwrite this with nothing so it doesn't lose durability.
        // TODO: change this to be propery check based on Item proto.
    }

    damage (amount, source) { //TODO why is this here? does nothing that the parent doesnt already do
        super.damage(amount, source);
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
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemEtherweave;

const StatNames = require('./../../stats/Statset').prototype.StatNames;

ItemEtherweave.prototype.registerItemType();
ItemEtherweave.prototype.idName = "Mage robe";
ItemEtherweave.prototype.PickupType = require('../../entities/destroyables/pickups/PickupEtherweave');
ItemEtherweave.prototype.iconSource = "icon-mage-robe";
ItemEtherweave.prototype.useGloryCost = 10;
ItemEtherweave.prototype.category = Clothes.prototype.categories.Clothing;
ItemEtherweave.prototype.defenceBonus = 0.2;
ItemEtherweave.prototype.statBonuses = {
    [StatNames.Magic]: 2
};