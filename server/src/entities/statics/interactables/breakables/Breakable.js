
const Interactable = require('../Interactable');

function nothing() { }

class Breakable extends Interactable {

    /**
     * @param {Object} config
     * @param {Number} config.row
     * @param {Number} config.col
     * @param {Board} config.board
     * @param {Number} [config.activeState = true] - Whether this entity is already active when created.
     */
    constructor(config) {
        super(config);

        // If this breakable is in a dungeon or a safe zone, remove all of the hitpoints related properties so it cannot be broken.
        //if(this.board.dungeon === true){ TODO uncomment this when buildings are made damagable again
        //    this.hitPoints = null;
        //    this.maxHitPoints = null;
        //    this.onModHitPoints = nothing;
        //    this.onAllHitPointsLost = nothing;
        //    this.onDamage = nothing;
        //    this.onHeal = nothing;
        //}
    }

    isLowBlocked() {
        if (this.blocking === false) return false;
        //if((this.hitPoints > 0) === true) return true;
        if (this._lowBlocked === true) return true;

        return false;
    }

    isHighBlocked() {
        if (this.blocking === false) return false;
        // Don't use <=, as null <= 0 is true for some reason... JS...
        //if((this.hitPoints > 0) === true) return true;
        if (this._highBlocked === true) return true;

        return false;
    }

    /**
     * Hitpoints are to be subtracted from this entity.
     * If HP goes <0, then onAllHitPointsLost is called.
     * Breakables are NEVER destroyed.
     * This is the end of the call chain for breakables. Don't go up to Entity.
     * @param {Number} amount - How much to decrease by.
     * @param {Entity} [source] - The entity that caused this damage.
     */
    /*onDamage (amount, source) {
        console.log("breakable ondamage:", amount);

        this.hitPoints += amount;

        console.log("breakable hp:", this.hitPoints);

        // Check if this entity is destroyed.
        if(this.hitPoints <= 0){
            this.onAllHitPointsLost();
        }
        // Entity is still alive. Tell nearby players.
        else {
            this.board.emitToNearbyPlayers(this.row, this.col, this.EventsList.breakable_damaged, {id: this.row + "-" + this.col, amount: amount});
        }
    }*/

    /**
     * All hitpoints have been lost. This breakable is now broken.
     */
    /*onAllHitPointsLost () {
        console.log("breakable onallHPlost:");
        // The breakable might be waiting to reactive when broken. Deal with the timeout that would fire.
        clearTimeout(this.reactivationTimer);

        // Tell nearby players this entity is now broken.
        this.board.emitToNearbyPlayers(this.row, this.col, this.EventsList.breakable_broken, this.row + "-" + this.col);

        this.activeState = false;

        // If a repair rate is set, start a timer to reactivate this object.
        if(this.repairRate !== null){
            this.repairTimer = setTimeout(this.activate.bind(this), this.repairRate);
        }

    }

    getEmittableProperties (properties) {
        properties.brokenState = this.hitPoints <= 0;
        return super.getEmittableProperties(properties);
    }*/

    /**
     * @param {Character} interactedBy
     * @param {Item} toolUsed
     */
    interaction(interactedBy, toolUsed) {
        //console.log("* WARNING: Breakable entity type defined without overriding Breakable.interaction:", this.typeNumber);
    }

    /**
     * Make this breakable not broken any more.
     */
    /*repair () {
        // Check there are no obstructions on the object before repairing it.
        if(this.board.grid[this.row][this.col].containsAnyDestroyables() === false){
            // Nothing in the way. Repair this object.
            this.hitPoints = this.maxHitPoints;
            this.activeState = true;

            // Tell any nearby players that this object is now repaired.
            this.board.emitToNearbyPlayers(this.row, this.col, this.EventsList.breakable_repaired, this.row + "-" + this.col);
        }
        // Something in the way.
        else {
            // Restart the timer to activate this object.
            this.repairTimer = setTimeout(this.repair.bind(this), this.repairRate);
        }
    }*/

}
module.exports = Breakable;

//Breakable.prototype.hitPoints = 100;
//Breakable.prototype.maxHitPoints = 100;

/**
 * How long (in ms) before repair after being broken.
 * @type {Number}
 */
//Breakable.prototype.repairRate = 10000;

/**
 * The ID of the timer that will repair this object. Used to stop timers before they fire.
 * @type {Number}
 */
//Breakable.prototype.repairTimer = null;