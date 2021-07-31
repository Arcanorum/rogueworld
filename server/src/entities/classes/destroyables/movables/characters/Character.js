const Movable = require("../Movable");
const GroundTypes = require("../../../../../board/GroundTypes");
const Damage = require("../../../../../gameplay/Damage");
const EntitiesList = require("../../../../EntitiesList");
const { rowColOffsetToDirection } = require("../../../../../gameplay/Directions");

class Character extends Movable {
    /**
     * @param {Number} config.row
     * @param {Number} config.col
     * @param {Board} config.board
     * @param {Number} config.maxHitPoints
     * @param {Number} config.maxEnergy
     * @param {Number} config.energyRegenRate - How often this character regenerates energy, in ms.
     */
    constructor(config) {
        super(config);

        this.hitPoints = this.maxHitPoints;

        this.statusEffects = {};

        this.checkedColliders = [];
    }

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

        // If there is curse applied to the character, then trigger it on damage received.
        if (this.curse !== undefined && this.curse !== null) {
            if (this.curse.onCharacterDamaged() === false) {
                return;
            }
        }
        // Apply the damage reduction multiplier from defence bonuses.
        if (this.defence >= 0) {
            let effectiveDefence = this.defence;
            if (damage.armourPiercing > 0) {
                const apPercentage = damage.armourPiercing / 100;
                effectiveDefence = this.defence - (this.defence * apPercentage);
            }
            const multipler = (100 / (100 + effectiveDefence));
            damage.amount *= multipler;
        }
        // Negative defence means bonus damage multiplier.
        else {
            damage.amount *= (2 - (100 / (100 - (this.defence))));
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
                if (this.CorpseType !== null) {
                    new this.CorpseType({
                        row: this.row,
                        col: this.col,
                        board: this.board,
                    }).emitToNearbyPlayers();
                }
            }
        }
        // No curse. Just create the corpse.
        else if (this.CorpseType !== null) {
            new this.CorpseType({
                row: this.row,
                col: this.col,
                board: this.board,
            }).emitToNearbyPlayers();
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
        properties.moveRate = this.moveRate;
        return super.getEmittableProperties(properties);
    }

    /**
     * @param {Number} amount
     */
    modDefence(amount) {
        this.defence += amount;
    }

    getMoveRate(chainedMoveRate) {
        let moveRate = chainedMoveRate || this.moveRate;

        // Check for any status effects that modify the move rate.
        Object.values(this.statusEffects).forEach((statusEffect) => {
            moveRate *= statusEffect.moveRateModifier;
        });

        return moveRate;
    }

    /**
     * @param {Number} byRows
     * @param {Number} byCols
     * @param {Number} [changeDirection=true] Whether the entity should be turned to face the direction being moved in.
     * @returns {Boolean}
     */
    move(byRows, byCols, changeDirection = true) {
        if (!this.board) return false;

        // Get the direction from the move offset.
        const direction = rowColOffsetToDirection(byRows, byCols);

        // Update and tell any nearby players the new direction if it is different than the previous direction.
        if (changeDirection && direction !== this.direction) {
            this.modDirection(direction);
        }

        const currentBoard = this.board;

        /** @type {BoardTile} */
        const nextBoardTile = currentBoard.getTileAt(this.row + byRows, this.col + byCols);

        if (!nextBoardTile) return false;

        // If there is an interactable ahead, interact with it.
        if (nextBoardTile.static !== null) {
            if (nextBoardTile.static.interaction !== undefined) {
                nextBoardTile.static.interaction(this);

                // Might have interacted with a portal or
                // something which could have changed the board.
                // Check if we are still on the same board.
                if (currentBoard !== this.board) {
                    return false;
                }
            }
        }

        // Check path isn't blocked.
        if (nextBoardTile.isLowBlocked() === true) return false;

        // Check if the next tile can be stood on.
        if (nextBoardTile.groundType.canBeStoodOn === false) return false;
        // If it is water, take some energy.
        if (nextBoardTile.groundType === GroundTypes.ShallowWater) {
            // Check it has energy. Might be a mob.
            if (this.energy !== undefined) {
                // Check the player has any energy.
                if (this.energy > 0) this.modEnergy(-1);
                // No energy. Can't move.
                else return false;
            }
        }

        // Prevent the move if they died from being hit by something above.
        if (this._destroyed) {
            return false;
        }

        // Move the entity.
        super.move(byRows, byCols);

        this.checkedColliders = [];

        return true;
    }

    postMove() {
        const { groundType, destroyables } = this.getBoardTile();

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
                    armourPiercing: groundType.damageArmourPiercing,
                }),
            );
        }

        // Check for any projectiles they might be now colliding with.
        Object.values(destroyables).forEach((destroyable) => {
            if (destroyable instanceof EntitiesList.AbstractClasses.Projectile) {
                // Might be some recursion going on with being pushed between two projectiles
                // (i.e. winds, hammers), so don't keep the cycle going if collisions for things
                // that have already been checked.
                if (this.checkedColliders.includes(destroyable)) {
                    return;
                }

                // Add to the checked list so it doesn't get done again in the same call somehow.
                this.checkedColliders.push(destroyable);

                destroyable.checkCollisions();
            }

            // Do any logic that should happen when this character moves into the destroyable.
            destroyable.onMovedInto(this);
        });
    }

    repositionAndEmitToNearbyPlayers(toRow, toCol) {
        if (this.board.grid[toRow][toCol].groundType.canBeStoodOn === false) return false;
        super.repositionAndEmitToNearbyPlayers(toRow, toCol);
        return true;
    }

    /**
     * Forces this entity to move.
     * @param {number} byRows How many rows to push by. Positive is right, negative is left.
     * @param {number} byCols How many columns to push by. Positive is right, negative is left.
     * @param {number} tileCount How many tiles to be pushed in/how many consecutive moves to do.
     * @param {boolean} changeDirection Whether the entity should be turned to face the direction of this push.
     */
    push(byRows, byCols, tileCount, changeDirection) {
        if (tileCount) {
            for (let i = 0; i < tileCount; i += 1) {
                // Check this entity is still on the board each iteration, as it might have
                // been removed in a previous push (i.e. mob dies being pushed into a hazard).
                if (!this.board) return;

                this.move(byRows, byCols, changeDirection, true);
            }
        }
        else {
            this.move(byRows, byCols, changeDirection, true);
        }
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
        Object.values(this.statusEffects).forEach((statusEffect) => statusEffect.stop());
    }
}
module.exports = Character;

Character.abstract = true;

// Give each character easy access to the factions list.
Character.prototype.Factions = require("../../../../../gameplay/Factions");

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
