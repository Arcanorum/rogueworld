class GroundTile {
    /**
     * @param {Object} config
     * @param {String} config.name - A unique name for this type of tile.
     * @param {Object} [config.damageConfig]
     * @param {Number} [config.damageConfig.amount] - How much damage this tile deals to entities that stand on it.
     * @param {Array} [config.damageConfig.types]
     * @param {Number} [config.damageConfig.armourPiercing]
     * @param {Boolean} [config.canBeStoodOn=true] - Whether this tile can be stood on.
     * @param {Boolean} [config.canBeBuiltOn=false] - Whether this tile can be built on (clan structures).
     * @param {Function} [config.StatusEffect=null] - A status effect class that can be applied to entities that stand on it.
     */
    constructor(config) {
        this.name = config.name;

        if (config.damageConfig) {
            this.damageAmount = config.damageConfig.amount;
            this.damageTypes = config.damageConfig.types;
            this.damageArmourPiercing = config.damageConfig.armourPiercing;
        }

        if (config.canBeStoodOn === false) this.canBeStoodOn = false;

        if (config.canBeBuiltOn === true) this.canBeBuiltOn = true;

        if (config.StatusEffect) this.StatusEffect = config.StatusEffect || null;

        if (this.damageAmount > 0) this.hazardous = true;

        if (this.StatusEffect !== null) {
            if (this.StatusEffect.prototype.hazardous === true) this.hazardous = true;
        }
    }
}
GroundTile.prototype.damageAmount = 0;
GroundTile.prototype.damageTypes = [];
GroundTile.prototype.damageArmourPiercing = 0;
GroundTile.prototype.canBeStoodOn = true;
GroundTile.prototype.canBeBuiltOn = false;
GroundTile.prototype.StatusEffect = null;
GroundTile.prototype.hazardous = false;

module.exports = GroundTile;
