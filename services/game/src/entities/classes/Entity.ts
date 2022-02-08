import { Counter } from '@dungeonz/utils';
import Damage from '../../gameplay/Damage';
import DamageTypes from '../../gameplay/DamageTypes';
import Heal from '../../gameplay/Heal';
import { StatusEffect } from '../../gameplay/status_effects';
import Board from '../../space/Board';

const idCounter = new Counter();

export interface EntityConfig {
    row: number;
    col: number;
    board: Board;
}

abstract class Entity {
    /**
     * Whether this entity has had it's destroy method called, and is just waiting to be GCed, so shouldn't be usable any more.
     */
    private destroyed = false;

    /**
     * A unique id for this entity.
     */
    id: number;

    /**
     * The row this entity occupies on the board it is on.
     */
    row: number;

    /**
     * The column this entity occupies on the board it is on.
     */
    col: number;

    /**
     * The board that this entity is on.
     */
    board: Board;

    /**
     * Whether this entity is currently blocking movement on the tile it is on, but not projectiles.
     * If a tile is low blocked, it cannot be moved onto, but can still be shot over.
     */
    static lowBlocking = false;

    /**
     * Whether this entity is currently blocking movement and projectiles on the tile it is on.
     * If a tile is high blocked, it cannot be moved onto or shot over.
     */
    static highBlocking = false;

    /**
     * Whether this entity is capable of moving at all.
     * Things that can move: Players, most mobs.
     * Things that can not move: Walls, doors, rocks, trees (including tree-type mobs), item pickups.
     */
    static movable = false;

    /**
     * Whether this entity is currently blocking the low/high of this tile.
     */
    isBlocking = true;

    hitPoints = 0;

    maxHitPoints = 0;

    static damageTypeImmunities: Array<DamageTypes>;

    statusEffects: {[name: string]: StatusEffect} = {};

    constructor(config: EntityConfig) {
        this.id = idCounter.getNext();

        this.row = config.row;

        this.col = config.col;

        this.board = config.board;

        const _this = this.constructor as typeof Entity;

        // If a tile is high blocked, then it must also be low blocked.
        if (_this.highBlocking === true) {
            _this.lowBlocking = true;
        }

        this.isBlocking = true;
    }

    static registerEntityType() {
        return;
    }

    /**
     * Change the hitpoints value of this entity, if it has the hitpoints property set (not null).
     * Calls onDamage or onHeal based on the amount, and also onModHitPoints.
     * @param hitPointModifier An object that details how much to increase or decrease the HP by.
     * @param source The entity that caused this change.
     */
    modHitPoints(hitPointModifier: Damage|Heal, source?: Entity) {
        // Make it impossible to change the HP if this entity is destroyed.
        if (this.destroyed === true) return;

        // Make sure this is a damagable entity.
        if (this.hitPoints === null) return;

        const amount = Math.floor(hitPointModifier.amount);

        // Catch non-integer values, or the HP will bug out.
        if (Number.isInteger(amount) === false) return;

        // If damaged.
        if ((hitPointModifier as Damage).types) {
            this.onDamage(hitPointModifier as Damage, source);
        }
        // If healed.
        else {
            this.onHeal(hitPointModifier);
        }

        this.onModHitPoints();
    }

    /**
     * Restore hitpoints to this entity.
     * @param heal A heal config object.
     * @param source The entity that caused this healing.
     */
    heal(heal: Heal, source?: Entity) {
        // Make sure the amount is valid.
        if (heal.amount < 1) return;

        this.modHitPoints(heal, source);
    }

    /**
     * Hitpoints are to be added to this entity.
     * If overridden, should still be chained from the overrider up to this.
     * @param heal A heal config object.
     */
    onHeal(heal: Heal) {
        const amount = Math.floor(heal.amount);

        const original = this.hitPoints;

        this.hitPoints += amount;

        // Make sure they can't go above max HP.
        if (this.hitPoints > this.maxHitPoints) {
            this.hitPoints = this.maxHitPoints;
        }

        const difference = this.hitPoints - original;

        this.board.emitToNearbyPlayers(
            this.row,
            this.col,
            'heal',
            { id: this.id, amount: difference },
        );
    }

    /**
     * Deal damage to this entity. Lowers the hitpoints. Used mainly by weapons and melee mobs when attacking.
     * @param damage A damage config object.
     * @param source The entity that caused this damage.
     */
    damage(damage: Damage, source?: Entity) {
        this.modHitPoints(damage, source);
    }

    /**
     * Hitpoints are to be subtracted from this entity.
     * If HP goes <0, then onAllHitPointsLost is called.
     * This method does NOT destroy directly.
     * If overridden, should still be chained from the overrider up to this.
     * @param damage
     * @param source The entity that caused this damage.
     */
    onDamage(damage: Damage, source?: Entity) {
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
                'damage',
                { id: this.id, amount: -damage.amount },
            );
        }
    }

    /**
     * This entity has been taken to or below 0 hitpoints.
     * If overridden, should still be chained from the overrider up to this.
     */
    onAllHitPointsLost() { return; }

    /**
     * This entity has had its hitpoints changed.
     * If overridden, should still be chained from the overrider up to this.
     */
    onModHitPoints() { return; }

    /**
     * Get all of the properties of this entity that can be emitted to clients.
     * This method should be overridden on each subclass (and any further subclasses), and
     * then called on the superclass of every subclass, calling it's way back up to Entity.
     * So if Player.getEmittableProperties is called, it adds the relevant properties from Player, then
     * adds from Character, and so on until Entity, then returns the result back down the stack.
     * @param properties The properties of this entity that have been added so far. If this is the start of the chain, pass in an empty object.
     */
    getEmittableProperties(properties: object) {
        return properties;
    }

    /**
     * Returns the board tile this entity is currently occupying.
     * Shouldn't have to worry about the tile being valid, as they shouldn't be occupying an invalid tile.
     */
    getBoardTile() {
        return this.board.grid[this.row][this.col];
    }
}

export default Entity;
