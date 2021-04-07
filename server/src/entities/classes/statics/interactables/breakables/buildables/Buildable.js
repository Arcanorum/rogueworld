const Breakable = require("../Breakable");

class Buildable extends Breakable {
    /**
     * @param {Object} config
     * @param {Number} config.row
     * @param {Number} config.col
     * @param {Board} config.board
     * @param {Number} [config.activeState = true] - Whether this entity is already active when created.
     */
    constructor(config) {
        super(config);
        // Buildables are special entities that occupy the static slot of the tile they are on, like a
        // normal static, but are also added to the destroyables list so they can be send dynamically.
        config.board.addStatic(this);
        config.board.addDestroyable(this);

        /**
         * Whether this buildable entity is ready to be interacted with.
         * @type {Boolean}
         */
        this.activeState = true;
        if (config.activeState !== undefined) this.activeState = config.activeState;
    }

    onAllHitPointsLost() {
        // Prevent multiple destruction of entities.
        if (this._destroyed === true) return;

        this._destroyed = true;

        // The buildable might be waiting to reactive when destroyed. Deal with the timeout that would fire.
        clearTimeout(this.reactivationTimer);

        // If this belonged to a clan, remove this from it.
        if (this.clan !== null) {
            this.clan.removeStructure(this);
        }

        // Tell nearby players to remove this buildable entity.
        this.board.emitToNearbyPlayers(this.row, this.col, this.EventsList.remove_entity, this.id);

        this.board.removeStatic(this);
        this.board.removeDestroyable(this);
    }

    getEmittableProperties(properties) {
        return super.getEmittableProperties(properties);
    }

    /**
     * @param {Character} interactedBy
     * @param {Item} toolUsed
     */
    interaction(interactedBy, toolUsed) {
        // console.log("* WARNING: Buildable entity type defined without overriding Buildable.interaction:", this.typeNumber);
    }

    /**
     *
     */
    activate() {}

    /**
     *
     */
    deactivate() {}
}
module.exports = Buildable;

Buildable.prototype.warningEvent = null;

Buildable.prototype.blocking = true;

/**
 * How much energy is taken from a character when they interact with this.
 * @type {Number}
 */
Buildable.prototype.interactionEnergyCost = 0;

/**
 * The category of item that must be used by a character on this node, such as "Hatchet" for trees. See Item.prototype.categories.
 * Also used for coloured locked doors, with "RedKey" opening a red lock.
 * @type {String}
 */
Buildable.prototype.requiredToolCategory = null;

/**
 * How long (in ms) before reactivation after being deactivated.
 * @type {Number}
 */
Buildable.prototype.reactivationRate = null;

/**
 * The ID of the timer that will reactivate this object. Used to stop timers before they fire.
 * @type {Number}
 */
Buildable.prototype.reactivationTimer = null;

/**
 * If set, this entity is a clan structure, and this is a reference to that clan.
 * @type {Clan}
 */
Buildable.prototype.clan = null;
