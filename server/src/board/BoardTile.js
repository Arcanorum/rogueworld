const GroundTypes = require("./GroundTypes");

class BoardTile {
    constructor() {
        /**
         * The ground. Paths, dirt, water, lava, etc. Empty by default (no entities should be able to occupy this tile).
         * @type {GroundTile}
         */
        this.groundType = GroundTypes.Empty;

        /**
         * Whether players can take damage while on this tile.
         * @type {Boolean}
         */
        this.safeZone = false;

        /**
         * Entities that never move or change boards. Can be interacted with and state changed only if interactable.
         * Max one per tile.
         * @type {Static|null}
         */
        this.static = null;

        /**
         * A sepearate list of destroyables that can be picked up by players and added to their inventory.
         * Anything in here should also be in the destroyables list.
         * They don't interact with anything else, so less filtering other entities when being picked up.
         * Should NOT occupy a tile that has an active blocking static.
         * Accessed by their entity ID.
         * @type {Object}
         */
        this.pickups = {};

        /**
         * Entities that do not have a definite existence, and so must be sent dynamically to the player.
         * Pickups, Movables (can move and change board), Characters (players, mobs), Projectiles).
         * Should NOT occupy a tile that has an active blocking static.
         * Accessed by their entity ID.
         * @type {Object}
         */
        this.destroyables = {};

        /**
         * A separate list of destroyables just for Players, mainly for emitting events, less messing around filtering other entities.
         * Anything in here should also be in the destroyables list.
         * Accessed by their entity ID.
         * @type {Object}
         */
        this.players = {};
    }

    /**
     * Whether this tile is currently being low blocked by the static on it, if there is one.
     * @returns {Boolean}
     */
    isLowBlocked() {
        if (this.static === null) return false;

        return this.static.isLowBlocked();
    }

    /**
     * Whether this tile is currently being high blocked by the static on it, if there is one.
     * @returns {Boolean}
     */
    isHighBlocked() {
        if (this.static === null) return false;

        return this.static.isHighBlocked();
    }

    /**
     * Checks if this tile contains any destroyable entities. Is the destroyable object empty.
     * @returns {Boolean}
     */
    containsAnyDestroyables() {
        // Check if there are any own properties on the destroyables object.
        if (Object.keys(this.destroyables).length === 0) {
            return false;
        }

        return true;
    }
}
// Easy access to the list of ground types.
BoardTile.prototype.GroundTypes = GroundTypes;

module.exports = BoardTile;
