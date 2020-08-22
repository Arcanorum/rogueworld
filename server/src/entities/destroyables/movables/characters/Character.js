
const Movable = require('../Movable');

class Character extends Movable {

    /**
     * @param {Number} config.row
     * @param {Number} config.col
     * @param {Board} config.board
     * @param {String} config.displayName
     * @param {Number} config.maxHitPoints
     * @param {Number} config.maxEnergy
     * @param {Number} config.energyRegenRate - How often this character regenerates energy, in ms.
     */
    constructor(config) {
        super(config);

        this.hitPoints = this.maxHitPoints;

        this.displayName = config.displayName || '';

        this.statusEffects = {};
    }

    /**
     * @param {Damage} damage
     * @param {Entity} source
     */
    onDamage(damage, source) {
        // If they have a ward enchantment, ignore the damage.
        if (this.enchantment !== null) {
            if (this.enchantment.onCharacterDamaged() === false) {
                return;
            }
        }

        // If the character is immune to all of the types of the incoming damage, ignore the damage completely.
        // If any of the damage types are not blocked, the full damage is dealt.
        if (damage.canAffectTarget(this) === false) return;

        // Apply the damage reduction multiplier from defence bonuses.
        //console.log("char ondamage, damage:", damage.amount);
        if (this.defence >= 0) {
            //console.log("has defence:", this.defence);
            let effectiveDefence = this.defence;
            if (damage.armourPiercing > 0) {
                const apPercentage = damage.armourPiercing / 100;
                effectiveDefence = this.defence - (this.defence * apPercentage);
                //console.log("  armour piercing:", apPercentage);
            }
            //console.log("effective defence:", effectiveDefence);
            const multipler = (100 / (100 + effectiveDefence));
            damage.amount = damage.amount * multipler;
            //console.log("  after mod:", damage.amount);
        }
        // Negative defence means bonus damage multiplier.
        else {
            //console.log("no defence");
            damage.amount = damage.amount * (2 - (100 / (100 - (this.defence))));
            //console.log("  after mod:", damage.amount);
        }

        // Minimum damage is 1.
        if (damage.amount < 1) {
            damage.amount = 1;
        }

        super.onDamage(damage, source);
    }

    onAllHitPointsLost() {
        if (this.curse !== null) {
            // If should keep processing after curse has fired, create a corpse.
            if (this.curse.onCharacterDeath() === true) {
                // If this character has a corpse type, create a new corpse of the specified type.
                if (this.CorpseType !== null) new this.CorpseType({ row: this.row, col: this.col, board: this.board }).emitToNearbyPlayers();
            }
        }
        else {
            // No curse. Just create the corpse.
            if (this.CorpseType !== null) new this.CorpseType({ row: this.row, col: this.col, board: this.board }).emitToNearbyPlayers();
        }
        // Destroy this character.
        this.destroy();
    }

    onDestroy() {
        clearTimeout(this.energyRegenLoop); // TODO move to player?

        // Stop all status effects, otherwise they can keep being damaged, and
        // potentially die multiple times while already dead, or be healed and revived.
        this.removeStatusEffects();

        // Make sure this character is marked as dead, so anything that is targeting it will stop doing so.
        this.hitPoints = -1;

        if (this.curse !== null) this.curse.remove();
        if (this.enchantment !== null) this.enchantment.remove();

        super.onDestroy();
    }

    getEmittableProperties(properties) {
        properties.direction = this.direction;
        properties.displayName = this.displayName;
        return super.getEmittableProperties(properties);
    }

    /**
     * @param {Number} amount
     */
    modDefence(amount) {
        this.defence += amount;
    }

    /**
     * @param {Number} byRows
     * @param {Number} byCols
     * @returns {Boolean}
     */
    move(byRows, byCols) {
        if (!this.board) return;

        // Get the direction from the move offset.
        const direction = this.board.rowColOffsetToDirection(byRows, byCols);

        // Update and tell any nearby players the new direction if it is different than the previous direction.
        if (direction !== this.direction) {
            this.modDirection(direction);
        }

        const currentBoard = this.board;

        // Check the grid row element being accessed is valid.
        if (currentBoard.grid[this.row + byRows] === undefined) return false;

        /** @type {BoardTile} */
        const boardTile = currentBoard.grid[this.row + byRows][this.col + byCols];

        // Check the grid col element (the tile itself) being accessed is valid.
        if (boardTile === undefined) return false;

        // If there is an interactable ahead, interact with it.
        if (boardTile.static !== null) {
            if (boardTile.static.interaction !== undefined) {
                boardTile.static.interaction(this);

                // Might have interacted with a portal or 
                // something which could have changed the board.
                // Check if we are still on the same board.
                if (currentBoard !== this.board) {
                    return false;
                }
            }
        }

        // Check path isn't blocked.
        if (boardTile.isLowBlocked() === true) return false;

        // Check if the next tile can be stood on.
        if (boardTile.groundType.canBeStoodOn === false) return false;
        // If it is water, take some energy.
        if (boardTile.groundType === GroundTypes.ShallowWater) {
            // Check it has energy. Might be a mob.
            if (this.energy !== undefined) {
                // Check the player has any energy.
                if (this.energy > 0) this.modEnergy(-1);
                // No energy. Can't move.
                else return false;
            }
        }

        // Move the entity.
        super.move(byRows, byCols);

        return true;
    }

    postMove() {
        const groundType = this.board.grid[this.row][this.col].groundType;

        // Add the status effect FIRST, in case they die from the damage below, so they
        // don't have status effect while dead, as they should have all been removed.
        if (groundType.StatusEffect !== null) {
            this.addStatusEffect(groundType.StatusEffect);
        }

        // Damage if the ground type deals damage.
        if (groundType.damageAmount > 0) {
            this.damage(
                new Damage({
                    amount: groundType.damageAmount,
                    types: groundType.damageTypes,
                    armourPiercing: groundType.damageArmourPiercing
                })
            );
        }
    }

    /**
     * Something else forces this entity to move.
     * @param {Number} byRows
     * @param {Number} byCols
     */
    push(byRows, byCols) {
        this.move(byRows, byCols);
    }

    /**
     *
     * @param {Function} StatusEffect
     * @param {*} [source]
     */
    addStatusEffect(StatusEffect, source) {
        new StatusEffect(this, source);
    }

    removeStatusEffects() {
        for (let effectKey in this.statusEffects) {
            if (this.statusEffects.hasOwnProperty(effectKey) === false) continue;

            this.statusEffects[effectKey].stop();
        }
    }

}
module.exports = Character;

const GroundTypes = require('../../../../board/GroundTypes');
const Damage = require('../../../../gameplay/Damage');

// Give each character easy access to the factions list.
Character.prototype.Factions = require('../../../../gameplay/Factions');

/**
 * The faction that this character is a member of. Mobs won't attack other mobs of the same faction.
 * @type {Number}
 */
Character.prototype.faction = Character.prototype.Factions.Citizens;

/**
 * How many hitpoints this entity can lose before it dies.
 * @type {Number}
 */
Character.prototype.maxHitPoints = 200;
Character.prototype.hitPoints = Character.prototype.maxHitPoints;

Character.prototype.damageTypeImmunities = [];

/**
 * How much the damage reduction multipler should reduce incoming damage by.
 * 
 * Defence does not block damage outright, but instead follows an curve that
 * gives more effective HP with each point.
 * @see Character.onDamage for damage formula.
 * @type {Number}
 * @example
 * Defence:     Damage taken:   Reduction:
 * 0        =   100%            0
 * 10       =   91%             9%
 * 30       =   77%             23%
 * 50       =   66%             34%
 * 100      =   50%             50%
 * 200      =   33%             67%
 */
Character.prototype.defence = 0;

/** @type {Curse} */
Character.prototype.curse = null;
/** @type {Enchantment} */
Character.prototype.enchantment = null;
/** @type {Object} */
Character.prototype.statusEffects = null;

/**
 * What type of corpse entity will be created when this character is destroyed.
 * @type {Function}
 */
Character.prototype.CorpseType = null;