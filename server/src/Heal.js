class Heal {
    /**
     * A model of healing to be done.
     * @param {Object} config
     * @param {Number} config.amount How much hitpoints to restore.
     */
    constructor(amount) {
        this.amount = amount || 0;
    }

    /**
     * Override for same function in Damage. This will heal anything that can be healed.
     */
    canAffectTarget () {
        return true;
    }
    
}
module.exports = Heal;

/**
 * How many hitpoints this heal will restore.
 * @type {Number}
 */
Heal.prototype.amount = 0;