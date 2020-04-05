
const Static = require('../Static');

class Interactable extends Static {

    /**
     * @param {Object} config
     * @param {Number} config.row
     * @param {Number} config.col
     * @param {Board} config.board
     * @param {Number} [config.activeState=true] - Whether this entity is already active when created.
     */
    constructor (config) {
        super(config);

        this.activeState = true;
        if(config.activeState === false) this.activeState = false;
    }

    getEmittableProperties (properties) {
        properties.row = this.row;
        properties.col = this.col;
        return properties;
    }

    /**
     * @param {Character} interactedBy
     * @param {Item} toolUsed
     */
    interaction (interactedBy, toolUsed) {
        //console.log("* WARNING: Interactable entity type defined without overriding Interactable.interaction:", this.typeNumber);
    }

    /**
     * Activate this interactable.
     */
    activate () {
        // Check there are no obstructions on the object before activating it.
        if(this.board.grid[this.row][this.col].containsAnyDestroyables() === false){
            // Nothing in the way. Reactivate this object.
            this.activeState = true;

            // Tell any nearby players that this object can now be interacted with.
            this.board.emitToNearbyPlayers(this.row, this.col, this.EventsList.active_state, this.row + "-" + this.col);
        }
        // Something in the way.
        else {
            // Restart the timer to activate this object.
            this.reactivationTimer = setTimeout(this.activate.bind(this), this.reactivationRate || 5000); // Use some time in case it is null.
        }
    }

    /**
     * Deactivate this interactable.
     */
    deactivate () {
        this.activeState = false;

        // If a reactivation rate is set, start a timer to reactivate this object.
        if(this.reactivationRate !== null){
            this.reactivationTimer = setTimeout(this.activate.bind(this), this.reactivationRate);
        }

        // Tell any nearby players that this object has been interacted with.
        this.board.emitToNearbyPlayers(this.row, this.col, this.EventsList.inactive_state, this.row + "-" + this.col);
    }

}
module.exports = Interactable;

/**
 * Whether this interactable entity is ready to be interacted with.
 * @type {Boolean}
 * @default true
 */
Interactable.prototype.activeState = true;

/**
 * The default active state of this entity. Used to tell if there
 * has been a change that the client should be made aware of.
 * @type {Boolean}
 * @default true
 */
//Interactable.prototype.DEFAULT_ACTIVE_STATE = true;

/**
 * A warning event to send to the interacter, if they have done something wrong (such as using the wrong tool).
 * One of the properties in EventsList.
 * @type {Number|null}
 * @default null
 */
Interactable.prototype.warningEvent = null;

/**
 * How much energy is taken from a character when they interact with this.
 * @type {Number}
 * @default 0
 */
Interactable.prototype.interactionEnergyCost = 0;

/**
 * How much durability is taken from a tool when a character uses it to interact with this.
 * @type {Number}
 * @default 0
 */
Interactable.prototype.interactionDurabilityCost = 0;

/**
 * The category of item that must be used by a character on this node, such as "Hatchet" for trees. See Item.prototype.categories.
 * Also used for coloured locked doors, with "RedKey" opening a red lock.
 * @type {String}
 * @default null
 */
Interactable.prototype.requiredToolCategory = null;

/**
 * How long (in ms) before reactivation after being deactivated.
 * @type {Number}
 * @default null
 */
Interactable.prototype.reactivationRate = null;

/**
 * The ID of the timer that will reactivate this object. Used to stop timers before they fire.
 * @type {Number}
 * @default null
 */
Interactable.prototype.reactivationTimer = null;