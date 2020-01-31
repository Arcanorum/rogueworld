
class Damage {
    /**
     * 
     * @param {Object} config
     * @param {Number} config.amount How much damage to deal.
     * @param {Array.<Number>} [config.types=[Damage.Types.Physical]] The types of damage to deal. A list of Damage.Types.
     * @param {Number} config.piercing How much armour this damage will ignore. 0 to 1.
     */
    constructor(config) {
        if(config.amount) this.amount = amount;
        if(config.types) this.types = config.types;
        if(config.piercing) this.piercing = config.piercing;
    }

    /**
     * Checks if any of the types of this damage are not on a given entitys damage type immunity list.
     * @param {Entity} entity 
     */
    canAffectTarget (entity) {
         // Check the entity is immune to anything.
        if(entity.damageTypeImmunities){
            // Check every type of this damage.
            for(let type of this.types){
                // If the entity is immune to the current type, check the net one.
                if(entity.damageTypeImmunities.includes(type)){
                    continue;
                }
                // Entity is not immune to this damage type, they can be affected.
                return true;
            }
        }
        else {
            return true;
        }
        return false;
    }

    thing = 55;
}
module.exports = Damage;

/**
 * A list of the kinds of damage that this damage will deal.
 * Some entities can only be hit by projectiles of a certain type.
 * i.e. A normal sword would be physical, and would pass through 
 * a ghost, but an enchanted sword would be physical and magical,
 * so would hit the ghost, as the ghost takes magic type damage.
 * @type {Number}
 */
Damage.Types = {
    /**
     * @type {Number} Solid objects, such as swords, arrows, melee attacks and spike traps.
     */
    Physical: 0,
    /**
     * @type {Number} Magic related things, like fire balls, wind blasts and curses.
     */
    Magical: 1,
    /**
     * @type {Number} Organic related things, such as disease, poison, and possibly
     * environmental effects like heat and cold.
     */
    Biological: 2,
};

/**
 * How much damage (before armour mitigation) this damage will cause.
 * @type {Number}
 */
Damage.prototype.amount = 0;

/**
 * The types of damage this damage will cause. A list of Damage.Types.
 * @type {Array.<Number>}
 */
Damage.prototype.types = [
    Damage.Types.Physical
];

/**
 * What percent of armour will this projectile ignore when dealing damage.
 * From 0 to 1. 0.3 => 30%
 * @type {Number}
 */
Damage.prototype.piercing = 0;