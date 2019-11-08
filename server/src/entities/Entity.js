
var idCounter = 1;
var typeNumberCounter = 1;

class Entity {

    /**
     * @param {Object} config
     * @param {Number} config.row
     * @param {Number} config.col
     * @param {Board} config.board
     */
    constructor (config) {
        this.id = idCounter;
        idCounter+=1;

        this.row = config.row;
        this.col = config.col;
        this.board = config.board;
    }

    /**
     * Change the hitpoints value of this entity, if it has the hitpoints property set (not null).
     * Calls onDamage or onHeal based on the amount.
     * @param {Number} amount - How much to increase or decrease by.
     * @param {Entity} [source] - The entity that caused this change.
     */
    modHitPoints (amount, source) {
        amount = Math.floor(amount);
        // Catch non-integer values, or the HP will bug out.
        if(Number.isInteger(amount) === false) return;

        // Make it impossible to change the HP if this entity is destroyed.
        if(this._destroyed === true) return;

        // Make sure this is a damagable entity.
        if(this.hitPoints === null) return;

        // If damaged.
        if(amount < 0){
            this.onDamage(amount, source);
        }
        // Healed.
        else {
            this.onHeal(amount, source);
        }

        this.onModHitPoints();

        // Make sure they can't go above max HP.
        if(this.hitPoints > this.maxHitPoints){
            this.hitPoints = this.maxHitPoints;
        }
    }

    /**
     * Hitpoints are to be added to this entity.
     * If overwritten, should still be chained from the caller up to this.
     * @param {Number} amount - How much to increase by.
     * @param {Entity} [source] - The entity that caused this healing.
     */
    onHeal (amount, source) {
        amount = Math.floor(amount);
        this.hitPoints += amount;
        this.board.emitToNearbyPlayers(this.row, this.col, this.EventsList.heal, {id: this.id, amount: amount});
    }

    /**
     * Deal damage to this entity. Lowers the hitpoints. Used mainly by weapons and melee mobs when attacking.
     * @param {Number} amount - How much to decrease by. Use the absolute value, not negative.
     * @param {Entity} [source] - The entity that caused this damage.
     */
    damage (amount, source) {
        // Make sure the amount is valid. Might not have the attackPower set.
        if(amount === null) return;
        this.modHitPoints(-amount, source);
    }

    /**
     * Hitpoints are to be subtracted from this entity.
     * If HP goes <0, then onAllHitPointsLost is called.
     * This method does NOT destroy directly.
     * If overwritten, should still be chained from the caller up to this.
     * @param {Number} amount - How much to decrease by.
     * @param {Entity} [source] - The entity that caused this damage.
     */
    onDamage (amount, source) {
        amount = Math.floor(amount);
        this.hitPoints += amount;

        // Check if this entity is destroyed.
        if(this.hitPoints <= 0){
            this.onAllHitPointsLost();
        }
        // Entity is still alive. Tell nearby players.
        else {
            this.board.emitToNearbyPlayers(this.row, this.col, this.EventsList.damage, {id: this.id, amount: amount});
        }
    }

    /**
     * This entity has been taken to or below 0 hitpoints.
     * If overwritten, should still be chained from the caller up to this.
     */
    onAllHitPointsLost () {}

    /**
     * This entity has had its hitpoints changed.
     * If overwritten, should still be chained from the caller up to this.
     */
    onModHitPoints () {}

    /**
     * Get all of the properties of this entity that can be emitted to clients.
     * This method should be overwritten on each subclass (and any further subclasses), and
     * then called on the superclass of every subclass, calling it's way back up to Entity.
     * So if Player.getEmittableProperties is called, it adds the relevant properties from Player, then
     * adds from Character, and so on until Entity, then returns the result back down the stack.
     * @param {Object} properties - The properties of this entity that have been added so far. If this is the start of the chain, pass in an empty object.
     * @return {{}}
     */
    getEmittableProperties (properties) {
        //console.log("*  *   props:", properties);
        return properties;
    }

    /**
     * Returns a random direction.
     * @returns {String}
     */
    getRandomDirection () {
        const keys = Object.keys(this.Directions);
        return this.Directions[keys[keys.length * Math.random() << 0]];
    }

    /**
     * When finished constructing this entity, use this to tell the nearby players to add this entity.
     * @return {Entity}
     */
    emitToNearbyPlayers () {
        // Tell all players around this one (including itself) that this one has joined.
        this.board.emitToNearbyPlayers(this.row, this.col, this.EventsList.add_entity, this.getEmittableProperties({}));
        return this;
    }

    /**
     * Checks if another entity is cardinally adjacent to this one. Does NOT include if they are in the same position.
     * @param {Entity} entity
     * @return {Boolean}
     */
    isAdjacentToEntity (entity) {
        // Above.
        if(entity.row === this.row-1 && entity.col === this.col) return true;
        // Below.
        if(entity.row === this.row+1 && entity.col === this.col) return true;
        // Left.
        if(entity.row === this.row && entity.col === this.col-1) return true;
        // Right.
        if(entity.row === this.row && entity.col === this.col+1) return true;
        // Not adjacent.
        return false;
    }

    /**
     * Checks if any entity of the given type is cardinally adjacent to this one. Does NOT include if they are in the same position.
     * Useful for checking if a player is next to a bank chest, crafting station, etc. when attempting to bank/craft.
     * @param {Number} typeNumber
     * @return {Boolean}
     */
    isAdjacentToStaticType (typeNumber) {
        const grid = this.board.grid;
        // Above.
        if(grid[this.row-1][this.col].static !== null){
            if(grid[this.row-1][this.col].static.typeNumber === typeNumber){
                return true;
            }
        }
        // Below.
        if(grid[this.row+1][this.col].static !== null){
            if(grid[this.row+1][this.col].static.typeNumber === typeNumber){
                return true;
            }
        }
        // Left.
        if(grid[this.row][this.col-1].static !== null){
            if(grid[this.row][this.col-1].static.typeNumber === typeNumber){
                return true;
            }
        }
        // Right.
        if(grid[this.row][this.col+1].static !== null){
            if(grid[this.row][this.col+1].static.typeNumber === typeNumber){
                return true;
            }
        }
        // Not adjacent.
        return false;
    }

    /**
     * Checks if another entity is diagonally adjacent to this one. Does NOT include if they are in the same position.
     * @param {Entity} entity
     * @return {Boolean}
     */
    isDiagonalToEntity (entity) {
        // Above + left.
        if(entity.row === this.row-1 && entity.col === this.col-1) return true;
        // Above + right.
        if(entity.row === this.row-1 && entity.col === this.col+1) return true;
        // Below + left.
        if(entity.row === this.row+1 && entity.col === this.col-1) return true;
        // Below + right.
        if(entity.row === this.row+1 && entity.col === this.col+1) return true;
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
    checkSpawnCriteria (boardTile, dayPhase) {
        return true;
    }

}
module.exports = Entity;

const Utils = require('./../Utils');

// Give each entity easy access to the events list.
Entity.prototype.EventsList = require('../EventsList');

// A type number is an ID for all entities that appear on the client, so the client knows which entity to add.
// Used to send a number to get the entity name from the entity type catalogue, instead of a lengthy string of the entity name.
// All entities that appear on the client must be registered with ENTITY.prototype.registerEntityType().
Entity.prototype.typeNumber = 'Type not registered.';

Entity.prototype.registerEntityType = function () {

    this.typeNumber = typeNumberCounter;

    typeNumberCounter+=1;

    //console.log("* Registering entity type: ", this);

};

/**
 * Whether this entity has had it's destroy method called, and is just waiting to be GCed, so shouldn't be usable any more.
 * @type {Boolean}
 */
Entity.prototype._destroyed = false;

/**
 * Valid directions for an entity to be facing. Only movables have a direction property, but other things might need to
 * know in what direction to place things.
 * @type {{UP: string, DOWN: string, LEFT: string, RIGHT: string}}
 */
Entity.prototype.Directions = {
    UP: 'u',
    DOWN: 'd',
    LEFT: 'l',
    RIGHT: 'r'
};

/**
 * The inverse of the selected direction.
 * @type {{u: string, d: string, r: string, l: string}}
 */
Entity.prototype.OppositeDirections = {
    'u': 'd',
    'd': 'u',
    'r': 'l',
    'l': 'r'
};

Entity.prototype.maxHitPoints = null;
Entity.prototype.hitPoints = null;

Entity.prototype.taskIDKilled = null;
Entity.prototype.taskIDFrozen = null;
Entity.prototype.taskIDBurned = null;
Entity.prototype.taskIDInteracted = null;
Entity.prototype.taskIDGathered = null;
Entity.prototype.taskIDAnimated = null;