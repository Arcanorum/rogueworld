
class Damage {
    /**
     * 
     * @param {Number} config
     * @param {Number} config.amount How much damage to deal.
     * @param {Array.<Number>} config.types The types of damage to deal. A list of Damage.prototype.DamageTypes.
     * @param {Number} config.piercing How much armour this damage will ignore. 0 to 1.
     */
    constructor(config) {
        if(config.amount) this.amount = amount || 0;
        if(config.types) this.types = config.types || 0;
        if(config.piercing) this.piercing = config.piercing || 0;
    }

    /**
     * Checks if any of the types of this damage are not on a given entitys damage type immunity list.
     * @param {Entity} entity 
     */
    canAffectTarget (entity) {
        // Check every type of this damage 
        if(entity.damageTypeImmunities){
            for(let type of this.types){
                // If the entity is immune to the current type, skip it.
                if(entity.damageTypeImmunities.includes(type)){
                    continue;
                }
                // Entity is not immune to this damage type, they can be affected.
                return true;
            }
        }
        return false;
    }
}
module.exports = Damage;

const DamageTypes = require('./DamageTypes');

/**
 * A list of the kinds of damage that this projectile will deal.
 * Some entities can only be hit by projectiles of a certain type.
 * i.e. A normal sword would be physical, and would pass through 
 * a ghost, but an enchanted sword would be physical and magical,
 * so would hit the ghost, as the ghost takes magic type damage.
 * @type {Number}
 */
Damage.prototype.types = [
    DamageTypes.Physical
];

/**
 * What percent of armour will this projectile ignore when dealing damage.
 * From 0 to 1. 0.3 => 30%
 * @type {Number}
 */
Damage.prototype.piercing = 0;