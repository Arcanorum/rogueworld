const Item = require("../Item");

class Ammunition extends Item {
    
    destroy () {
        // If this item is being worn, take it off the owner.
        if(this.owner.ammunition === this){
            this.owner.modAmmunition(null);
        }
        super.destroy();
    }

    use () {
        this.equip();
    }

    /**
     * Use this ammunition item. Equips/removes it as the ammo used by the owner.
     */
    equip () {
        const owner = this.owner;

        // If this item is already being worn, take it off.
        if(owner.ammunition === this){
            this.unequip();
        }
        // Owner is trying to wear something else.
        else {
            // If they are already using something when equipping the new ammunition.
            if(owner.ammunition !== null){
                // Remove the CURRENT item before equipping another one.
                owner.ammunition.unequip();
            }
            // Equip this item.
            this.owner.modAmmunition(this);
        }

    }

    unequip () {
        this.owner.modAmmunition(null);
    }

}

Ammunition.abstract = true;

Ammunition.prototype.ProjectileType = null;

module.exports = Ammunition;