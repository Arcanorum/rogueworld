
class GroundTile {

    /**
     *
     * @param {String} name - A unique name for this type of tile.
     * @param {Number} [damage=0] - How much damage this tile deals to entities that stand on it.
     * @param {Boolean} [canBeStoodOn=true] - Whether this tile can be stood on.
     * @param {Boolean} [canBeBuiltOn=false] - Whether this tile can be built on (clan structures).
     * @param {Function} [StatusEffect=null] - A status effect class that can be applied to entities that stand on it.
     */
    constructor (name, damage, canBeStoodOn, canBeBuiltOn, StatusEffect) {

        this.name = name;

        this.damage = damage || 0;

        this.canBeStoodOn = true;
        if(canBeStoodOn === false) this.canBeStoodOn = false;

        this.canBeBuiltOn = false;
        if(canBeBuiltOn === true) this.canBeBuiltOn = true;

        this.StatusEffect = StatusEffect || null;

        this.hazardous = false;
        if(this.damage > 0) this.hazardous = true;
        if(this.StatusEffect !== null){
            if(this.StatusEffect.prototype.hazardous === true) this.hazardous = true;
        }

    }

}

module.exports = GroundTile;