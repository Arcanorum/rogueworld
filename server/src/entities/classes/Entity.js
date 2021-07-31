const Utils = require("../../Utils");
const Damage = require("../../gameplay/Damage");
const Heal = require("../../gameplay/Heal");
const DayPhases = require("../../DayPhases");
const { Directions } = require("../../gameplay/Directions");

const idCounter = new Utils.Counter();
const typeNumberCounter = new Utils.Counter();

class Entity {
    /**
     * @param {Object} config
     * @param {Number} config.row
     * @param {Number} config.col
     * @param {Board} config.board
     */
    constructor(config) {
        this.id = idCounter.getNext();

        this.row = config.row;
        this.col = config.col;
        this.board = config.board;
    }

    static registerEntityType() {
        this.prototype.typeNumber = typeNumberCounter.getNext();

        // Utils.message("Registering entity type: ", this.prototype.typeNumber);
    }

    /**
     * Remove this entity from the game world completely, and allow it to be GCed.
     * Any specific destruction functionality should be added to onDestroy, which is called from this method.
     */
    destroy() {
        // Prevent multiple destruction of entities.
        if (this._destroyed === true) return;

        this._destroyed = true;

        this.onDestroy();
    }

    /**
     * Specific destruction functionality. If overridden, should still be chained from the overrider up to this.
     */
    onDestroy() {
        // Remove the reference to the board it was on (that every entity
        // has), so it can be cleaned up if the board is to be destroyed.
        this.board = null;
    }

    /**
     * When another entity moves into the same tile as this entity.
     * @param {Entity} otherEntity - The entity that moved.
     */
    onMovedInto(otherEntity) { }

    /**
     * Change the hitpoints value of this entity, if it has the hitpoints property set (not null).
     * Calls onDamage or onHeal based on the amount, and also onModHitPoints.
     * @param {Damage|Heal} hitPointModifier - How much to increase or decrease by.
     * @param {Entity} [source] - The entity that caused this change.
     */
    modHitPoints(hitPointModifier, source) {
        // Make it impossible to change the HP if this entity is destroyed.
        if (this._destroyed === true) return;

        // Make sure this is a damagable entity.
        if (this.hitPoints === null) return;

        const amount = Math.floor(hitPointModifier.amount);

        // Catch non-integer values, or the HP will bug out.
        if (Number.isInteger(amount) === false) return;

        // If damaged.
        if (hitPointModifier instanceof Damage) {
            this.onDamage(hitPointModifier, source);
        }
        // If healed.
        else if (hitPointModifier instanceof Heal) {
            this.onHeal(hitPointModifier);
        }
        else {
            Utils.warning("Hitpoint modifier passed into Entity.modHitPoints is not an instance of either Damage or Heal. hitPointModifier:", hitPointModifier);
        }

        this.onModHitPoints();

        // Make sure they can't go above max HP.
        if (this.hitPoints > this.maxHitPoints) {
            this.hitPoints = this.maxHitPoints;
        }
    }

    /**
     *
     * @param {Heal} heal
     * @param {Entity} source
     */
    heal(heal, source) {
        if ((heal instanceof Heal) === false) {
            Utils.error("Entity.heal must be passed a Heal config object. Value of 'heal':", heal);
        }
        // Make sure the amount is valid.
        if (heal.amount === null) return;
        this.modHitPoints(heal, source);
    }

    /**
     * Hitpoints are to be added to this entity.
     * If overridden, should still be chained from the overrider up to this.
     * @param {Heal} heal - A heal config object.
     */
    onHeal(heal) {
        const amount = Math.floor(heal.amount);
        this.hitPoints += amount;
        this.board.emitToNearbyPlayers(
            this.row,
            this.col,
            this.EventsList.heal,
            { id: this.id, amount },
        );
    }

    /**
     * Deal damage to this entity. Lowers the hitpoints. Used mainly by weapons and melee mobs when attacking.
     * @param {Damage} damage - A damage config object.
     * @param {Entity} [source] - The entity that caused this damage.
     */
    damage(damage, source) {
        if ((damage instanceof Damage) === false) {
            Utils.error("Entity.damage must be passed a Damage config object. Value of 'damage':", damage);
        }

        this.modHitPoints(damage, source);
    }

    /**
     * Hitpoints are to be subtracted from this entity.
     * If HP goes <0, then onAllHitPointsLost is called.
     * This method does NOT destroy directly.
     * If overridden, should still be chained from the overrider up to this.
     * @param {Damage} damage
     * @param {Entity} [source] - The entity that caused this damage.
     */
    onDamage(damage, source) {
        damage.amount = Math.floor(damage.amount);
        this.hitPoints -= damage.amount;

        // Check if this entity is destroyed.
        if (this.hitPoints <= 0) {
            this.onAllHitPointsLost();
        }
        // Entity is still alive. Tell nearby players.
        else {
            this.board.emitToNearbyPlayers(
                this.row,
                this.col,
                this.EventsList.damage,
                { id: this.id, amount: -damage.amount },
            );
        }
    }

    /**
     * This entity has been taken to or below 0 hitpoints.
     * If overridden, should still be chained from the overrider up to this.
     */
    onAllHitPointsLost() { }

    /**
     * This entity has had its hitpoints changed.
     * If overridden, should still be chained from the overrider up to this.
     */
    onModHitPoints() { }

    /**
     * Get all of the properties of this entity that can be emitted to clients.
     * This method should be overridden on each subclass (and any further subclasses), and
     * then called on the superclass of every subclass, calling it's way back up to Entity.
     * So if Player.getEmittableProperties is called, it adds the relevant properties from Player, then
     * adds from Character, and so on until Entity, then returns the result back down the stack.
     * @param {Object} properties - The properties of this entity that have been added so far. If this is the start of the chain, pass in an empty object.
     * @returns {{}}
     */
    getEmittableProperties(properties) {
        return properties;
    }

    /**
     * Returns the board tile this entity is currently occupying.
     * Shouldn't have to worry about the tile being valid, as they shouldn't be occupying an invalid tile.
     * @returns {BoardTile}
     */
    getBoardTile() {
        return this.board.grid[this.row][this.col];
    }

    /**
     * Returns a random direction.
     * @returns {String}
     */
    getRandomDirection() {
        const keys = Object.keys(Directions);
        // eslint-disable-next-line no-bitwise
        return Directions[keys[keys.length * Math.random() << 0]];
    }

    /**
     * When finished constructing this entity, use this to tell the nearby players to add this entity.
     * @returns {Entity}
     */
    emitToNearbyPlayers() {
        // Tell all players around this one (including itself) that this one has joined.
        this.board.emitToNearbyPlayers(
            this.row,
            this.col,
            this.EventsList.add_entity,
            this.getEmittableProperties({}),
        );
        return this;
    }

    /**
     * Checks if another entity is cardinally adjacent to this one. Does NOT include if they are in the same position.
     * @param {Entity} entity
     * @returns {Boolean}
     */
    isAdjacentToEntity(entity) {
        // Above.
        if (entity.row === this.row - 1 && entity.col === this.col) return true;
        // Below.
        if (entity.row === this.row + 1 && entity.col === this.col) return true;
        // Left.
        if (entity.row === this.row && entity.col === this.col - 1) return true;
        // Right.
        if (entity.row === this.row && entity.col === this.col + 1) return true;
        // Not adjacent.
        return false;
    }

    /**
     * Checks if any entity of the given type is cardinally adjacent to this one. Does NOT include if they are in the same position.
     * Useful for checking if a player is next to a bank chest, crafting station, etc. when attempting to bank/craft.
     * @param {Number} typeNumber
     * @returns {Boolean}
     */
    isAdjacentToStaticType(typeNumber) {
        const { grid } = this.board;
        // Above.
        if (grid[this.row - 1][this.col].static !== null) {
            if (grid[this.row - 1][this.col].static.typeNumber === typeNumber) {
                return true;
            }
        }
        // Below.
        if (grid[this.row + 1][this.col].static !== null) {
            if (grid[this.row + 1][this.col].static.typeNumber === typeNumber) {
                return true;
            }
        }
        // Left.
        if (grid[this.row][this.col - 1].static !== null) {
            if (grid[this.row][this.col - 1].static.typeNumber === typeNumber) {
                return true;
            }
        }
        // Right.
        if (grid[this.row][this.col + 1].static !== null) {
            if (grid[this.row][this.col + 1].static.typeNumber === typeNumber) {
                return true;
            }
        }
        // Not adjacent.
        return false;
    }

    /**
     * Checks if another entity is diagonally adjacent to this one. Does NOT include if they are in the same position.
     * @param {Entity} entity
     * @returns {Boolean}
     */
    isDiagonalToEntity(entity) {
        // Above + left.
        if (entity.row === this.row - 1 && entity.col === this.col - 1) return true;
        // Above + right.
        if (entity.row === this.row - 1 && entity.col === this.col + 1) return true;
        // Below + left.
        if (entity.row === this.row + 1 && entity.col === this.col - 1) return true;
        // Below + right.
        if (entity.row === this.row + 1 && entity.col === this.col + 1) return true;
        // Not adjacent.
        return false;
    }

    /**
     * Checks whether this type of entity can be spawned on the given board tile.
     * Useful for checking special criteria, such as time of day for certain creatures.
     * @param {BoardTile} boardTile - The board tile to spawn the entity on.
     * @param {Number} dayPhase - The time of day that the world is currently on.
     * @returns {Boolean}
     */
    checkSpawnCriteria(boardTile, dayPhase) {
        if (!this.spawnableDayPhases[dayPhase]) return false;

        return true;
    }
}
module.exports = Entity;

Entity.abstract = true;

// Give each entity easy access to the events list.
Entity.prototype.EventsList = require("../../EventsList");

// A type number is an ID for all entities that appear on the client, so the client knows which entity to add.
// Used to send a number to get the entity name from the entity type catalogue, instead of a lengthy string of the entity name.
// All entities that appear on the client must be registered with ENTITY.prototype.registerEntityType().
Entity.prototype.typeNumber = null;

/**
 * Whether this entity has had it's destroy method called, and is just waiting to be GCed, so shouldn't be usable any more.
 * @type {Boolean}
 */
Entity.prototype._destroyed = false;

/**
 * How often (in ms) this entity type takes to respawn from the spawner it is from.
 * This is just for entity spawners. Do not confuse with player respawns.
 * @type {Number}
 */
Entity.prototype.spawnRate = 60000;

/**
 * A list of times of day that this entity can be spawned during.
 * @type {Array.<Number>}
 */
Entity.prototype.spawnableDayPhases = {
    [DayPhases.Dawn]: true,
    [DayPhases.Day]: true,
    [DayPhases.Dusk]: true,
    [DayPhases.Night]: true,
};

Entity.prototype.maxHitPoints = null;
Entity.prototype.hitPoints = null;

Entity.prototype.taskIdKilled = null;
Entity.prototype.taskIdFrozen = null;
Entity.prototype.taskIdBurned = null;
Entity.prototype.taskIdInteracted = null;
Entity.prototype.gatherTaskId = null;
Entity.prototype.taskIdAnimated = null;
