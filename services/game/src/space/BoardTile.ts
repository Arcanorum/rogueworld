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
     * Anything that can be added to and be removed from a board, change board, or can move.
     * Should NOT occupy a tile that has an active blocking static.
     * Accessed by their entity ID.
     * Keep this on the prototype, so not every instance has this as it's own property.
     * Just add it as an own property for the tiles that need it.
     * Saves a lot of memory. Like, hundreds of MB...
     */
    entities!: { [key: string]: Entity };

    /**
     * A sepearate list of entities that can be picked up by players and added to their inventory.
     * Anything in here should also be in the entities list.
     * They don't interact with anything else, so less filtering other entities when being picked up.
     * Should NOT occupy a tile that has an active blocking static.
     * Accessed by their entity ID.
     * Keep this on the prototype, so not every instance has this as it's own property.
     * Saves a lot of memory. Like, hundreds of MB...
     */
    pickups!: { [key: string]: Pickup };

    /**
     * A separate list of entities just for Players, mainly for emitting events, less messing around filtering other entities.
     * Anything in here should also be in the entities list.
     * Accessed by their entity ID.
     * Keep this on the prototype, so not every instance has this as it's own property.
     * Just add it as an own property for the tiles that need it.
     * Saves a lot of memory. Like, hundreds of MB...
     */
    players!: { [key: string]: Player };

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
        // Check if there are any own properties on the entities object.
        return !(Object.keys(this.entities).length === 0);
    }

    /**
     * Checks if this tile contains any players. Is the players object empty.
     */
    containsAnyPlayers() {
        // Check if there are any own properties on the players object.
        return !(Object.keys(this.players).length === 0);
    }

    /**
     * Checks if this tile contains any pickups. Is the pickups object empty.
     */
    containsAnyPickups() {
        // Check if there are any own properties on the pickups object.
        return !(Object.keys(this.pickups).length === 0);
    }

    /**
     * Gets the first entity that can be found on this tile.
     * @returns Whatever entity is at the top of the entities list, or undefined if there are no entities.
     */
    getFirstEntity() {
        for(const key in this.entities) {
            if(this.entities.hasOwnProperty(key)) {
                return this.entities[key];
            }
        }
        return;
    }

    /**
     * Adds the dynamics of a tile to a given list.
     * Useful for building a view of what the player can
     * see in an area, or at the edge of their view range.
     */
    addToDynamicsList(dynamicsList: Array<object>) {
        // Get all of the dynamic entities on this board tile.
        Object.values(this.entities).forEach((entity) => {
            // Add the relevant data of this entity to the data to return.
            dynamicsList.push(
                entity.getEmittableProperties({}),
            );
        });
    }
}

BoardTile.prototype.groundType = Empty;

BoardTile.prototype.safeZone = false;

BoardTile.prototype.entities = {};

BoardTile.prototype.players = {};

BoardTile.prototype.pickups = {};

export default BoardTile;
