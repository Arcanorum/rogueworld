import Entity from '../entities/classes/Entity';
import Pickup from '../entities/classes/Pickup';
import Player from '../entities/classes/Player';
import GroundTile from './GroundTile';
import { Empty } from './GroundTypes';

class BoardTile {
    /**
     * The ground. Paths, dirt, water, lava, etc.
     * Empty by default (no entities should be able to occupy this tile).
     */
    groundType!: GroundTile;

    /**
     * Whether players can take damage while on this tile.
     */
    safeZone!: boolean;

    /**
     * Entities that do not have a definite existence, and so must be sent dynamically to the player.
     * Pickups, Movables (can move and change board), Characters (players, mobs), Projectiles).
     * Should NOT occupy a tile that has an active blocking static.
     * Accessed by their entity ID.
     * Keep this on the prototype, so not every instance has this as it's own property.
     * Just add it as an own property for the tiles that need it.
     * Saves a lot of memory. Like, hundreds of MB...
     */
    entities!: { [name: string]: Entity };

    /**
     * A sepearate list of entities that can be picked up by players and added to their inventory.
     * Anything in here should also be in the entities list.
     * They don't interact with anything else, so less filtering other entities when being picked up.
     * Should NOT occupy a tile that has an active blocking static.
     * Accessed by their entity ID.
     * Keep this on the prototype, so not every instance has this as it's own property.
     * Saves a lot of memory. Like, hundreds of MB...
     */
    pickups!: { [name: string]: Pickup };

    /**
     * A separate list of entities just for Players, mainly for emitting events, less messing around filtering other entities.
     * Anything in here should also be in the entities list.
     * Accessed by their entity ID.
     * Keep this on the prototype, so not every instance has this as it's own property.
     * Just add it as an own property for the tiles that need it.
     * Saves a lot of memory. Like, hundreds of MB...
     */
    players!: { [name: string]: Player };

    /**
     * Whether this tile is currently being low blocked by the static on it, if there is one.
     */
    isLowBlocked() {
        return Object
            .values(this.entities)
            .some((entity) => {
                return (entity.constructor as typeof Entity).lowBlocking;
            });
    }

    /**
     * Whether this tile is currently being high blocked by any entity on it, if there is one.
     */
    isHighBlocked() {
        return Object
            .values(this.entities)
            .some((entity) => {
                return (entity.constructor as typeof Entity).highBlocking;
            });
    }

    /**
     * Criteria for whether any more structures can be placed on this tile.
     */
    isBuildable() {
        if (this.safeZone === true) return false;

        if (this.groundType.canBeBuiltOn === false) return false;

        if (this.isLowBlocked() === true) return false;

        if (this.containsAnyEntities() === true) return false;

        return true;
    }

    /**
     * Checks if this tile contains any entities. Is the entities object empty.
     */
    containsAnyEntities() {
        if (!this.entities) return false;

        // Check if there are any own properties on the entities object.
        if (Object.keys(this.entities).length === 0) {
            return false;
        }

        return true;
    }

    /**
     * Adds the dynamics of a tile to a given list.
     * Useful for building a view of what the player can
     * see in an area, or at the edge of their view range.
     */
    addToDynamicsList(dynamicsList: Array<object>) {
        const { entities } = this;

        if (entities) {
            // Get all of the dynamic entities on this board tile.
            Object.values(entities).forEach((entity) => {
                // Add the relevant data of this entity to the data to return.
                dynamicsList.push(
                    entity.getEmittableProperties({}),
                );
            });
        }

        // TODO: is this still needed?
        // // The static of this tile may be interactable, so also get the state of it if it isn't
        // // in its default state.
        // const interactable = this.static;
        // // Check there is actually one there.
        // if (interactable !== null) {
        //     // Check if it is not in its default state. If not, add it to the data.
        //     // Also checks if it is actually an interactable.
        //     if (interactable.activeState === false) {
        //         // Add the relevant data of this entity to the data to return.
        //         dynamicsList.push(
        //             interactable.getEmittableProperties({}),
        //         );
        //     }
        // }
    }
}

BoardTile.prototype.groundType = Empty;

BoardTile.prototype.safeZone = false;

BoardTile.prototype.entities = {};

BoardTile.prototype.pickups = {};

BoardTile.prototype.players = {};

export default BoardTile;
