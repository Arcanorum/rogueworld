const Item = require("../Item");
const EntitiesList = require("../../../entities/EntitiesList");
const Utils = require("../../../Utils");

class Ammunition extends Item {
    static loadConfig(config) {
        this.prototype.ProjectileType = EntitiesList[config.ProjectileType];

        if (!this.prototype.ProjectileType) {
            Utils.error(`Loading ammunition config. Invalid projectile type name "${config.ProjectileType}" for configured item "${config.name}". Type to use must be in the entities list.`);
        }

        super.loadConfig(config);
    }

    destroy() {
        // If this item is being worn, take it off the owner.
        if (this.owner.ammunition === this) {
            this.owner.modAmmunition(null);
        }
        super.destroy();
    }

    use() {
        this.equip();
    }

    onUsed() {
        // Use this empty onUsed method to override the Item.prototype.onUsed one, or this item
        // type will be flagged as unusable and therefore won't have it's quantity reduced when
        // another item (i.e. a bow) uses it.
        super.onUsed();
    }

    /**
     * Use this ammunition item. Equips/removes it as the ammo used by the owner.
     */
    equip() {
        const { owner } = this;

        // If this item is already being worn, take it off.
        if (owner.ammunition === this) {
            this.unequip();
        }
        // Owner is trying to wear something else.
        else {
            // If they are already using something when equipping the new ammunition.
            if (owner.ammunition !== null) {
                // Remove the CURRENT item before equipping another one.
                owner.ammunition.unequip();
            }
            // Equip this item.
            this.owner.modAmmunition(this);
        }
    }

    unequip() {
        this.owner.modAmmunition(null);
    }
}

Ammunition.abstract = true;

Ammunition.prototype.ProjectileType = null;

module.exports = Ammunition;
