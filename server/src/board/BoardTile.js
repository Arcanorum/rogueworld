const GroundTypes = require("./GroundTypes");

class BoardTile {
    constructor() {

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

    isBuildable() {
        // Breakables can be occupied (moved over) if broken, but they should never be able to be built on.
        if (this.static !== null) {
            // console.log("  has a static");
            return false;
        }
        if (this.safeZone === true) {
            // console.log("  is a safe zone");
            return false;
        }
        if (this.groundType.canBeBuiltOn === false) {
            // console.log("  ground type can not be built on");
            return false;
        }
        if (this.containsAnyDestroyables() === true) {
            // console.log("  has a destroyable");
            return false;
        }

        // console.log("  is buildable");
        return true;
    }

    /**
     * Checks if this tile contains any destroyable entities. Is the destroyable object empty.
     * @returns {Boolean}
     */
    containsAnyDestroyables() {
        if (!this.destroyables) return false;

        // Check if there are any own properties on the destroyables object.
        if (Object.keys(this.destroyables).length === 0) {
            return false;
        }

        return true;
    }

    /**
     * Adds the dynamics of a tile to a given list.
     * Useful for building a view of what the player can
     * see in an area, or at the edge of their view range.
     * @param {Array} dynamicsList
     */
    addToDynamicsList(dynamicsList) {
        const { destroyables } = this;
        if (destroyables) {
            // Get all of the destroyable entities on this board tile.
            Object.values(destroyables).forEach((destroyable) => {
                // Add the relevant data of this entity to the data to return.
                dynamicsList.push(
                    destroyable.getEmittableProperties({}),
                );
            });
        }

        // The static of this tile may be interactable, so also get the state of it if it isn't
        // in its default state.
        const interactable = this.static;
        // Check there is actually one there.
        if (interactable !== null) {
            // Check if it is not in its default state. If not, add it to the data.
            // Also checks if it is actually an interactable.
            if (interactable.activeState === false) {
                // Add the relevant data of this entity to the data to return.
                dynamicsList.push(
                    interactable.getEmittableProperties({}),
                );
            }
        }
    }
}
// Easy access to the list of ground types.
BoardTile.prototype.GroundTypes = GroundTypes;

/**
 * The ground. Paths, dirt, water, lava, etc. Empty by default (no entities should be able to occupy this tile).
 * @type {GroundTile}
 */
BoardTile.prototype.groundType = GroundTypes.Empty;

/**
 * Whether players can take damage while on this tile.
 * @type {Boolean}
 */
BoardTile.prototype.safeZone = false;

/**
 * Entities that never move or change boards. Can be interacted with and state changed only if interactable.
 * Max one per tile.
 * @type {Static|null}
 */
BoardTile.prototype.static = null;

/**
 * Entities that do not have a definite existence, and so must be sent dynamically to the player.
 * Pickups, Movables (can move and change board), Characters (players, mobs), Projectiles).
 * Should NOT occupy a tile that has an active blocking static.
 * Accessed by their entity ID.
 * Keep this on the prototype, so not every instance has this as it's own property.
 * Just add it as an own property for the tiles that need it. Saves a lot of memory.
 * @type {Object}
 */
BoardTile.prototype.destroyables = {};

/**
 * A sepearate list of destroyables that can be picked up by players and added to their inventory.
 * Anything in here should also be in the destroyables list.
 * They don't interact with anything else, so less filtering other entities when being picked up.
 * Should NOT occupy a tile that has an active blocking static.
 * Accessed by their entity ID.
 * Keep this on the prototype, so not every instance has this as it's own property.
 * Just add it as an own property for the tiles that need it. Saves a lot of memory.
 * @type {Object}
 */
BoardTile.prototype.pickups = {};

/**
 * A separate list of destroyables just for Players, mainly for emitting events, less messing around filtering other entities.
 * Anything in here should also be in the destroyables list.
 * Accessed by their entity ID.
 * Keep this on the prototype, so not every instance has this as it's own property.
 * Just add it as an own property for the tiles that need it. Saves a lot of memory.
 * @type {Object}
 */
BoardTile.prototype.players = {};

module.exports = BoardTile;
