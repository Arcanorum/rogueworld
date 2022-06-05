import { Directions, DirectionsValues, ObjectOfUnknown, Offset, RowCol, SpriteConfig } from '@rogueworld/types';
import { Counter, getRandomElement } from '@rogueworld/utils';
import Action from '../../gameplay/actions/Action';
import ActionsList from '../../gameplay/actions/ActionsList';
import Damage from '../../gameplay/Damage';
import DamageTypes from '../../gameplay/DamageTypes';
import { rowColOffsetToDirection } from '../../gameplay/Directions';
import Heal from '../../gameplay/Heal';
import { Curse, Enchantment } from '../../gameplay/MagicEffects';
import { StatusEffect } from '../../gameplay/status_effects';
import Board from '../../space/Board';

const idCounter = new Counter();
const typeNumberCounter = new Counter();

export interface EntityConfig {
    row: number;
    col: number;
    board: Board;
}

class Entity {
    /**
     * Whether information from this entity type should be made available for the game client to
     * use on startup, such as when generating it's own entity class list, as some classes are only
     * meaningful as backend logic with no direct frontend representation, so shouldn't be added to
     * any catalogues.
     */
    static serverOnly = true;

    /**
     * A type number is an ID for all entities that appear on the client, so the client knows which entity to add.
     * Used to send a number to get the entity name from the entity type catalogue, instead of a lengthy string of the entity name.
     * All entities that appear on the client must be registered with ENTITYCLASS.registerEntityType().
     */
    static typeNumber: number;

    /**
     * Class name of this entity type. Useful for debugging.
     */
    static typeName: string;

    /**
     * Any configs that need to be passed to the entity types list for the game client to use when setting up the sprite classes.
     */
    static clientConfig: SpriteConfig = {};

    /**
     * Whether this entity has had it's destroy method called, and is just waiting to be GCed, so shouldn't be usable any more.
     */
    protected destroyed = false;

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
    board?: Board;

    static baseLifespan?: number = undefined;

    /**
     * How long an entity of this type lasts for after being spawned, before being destroyed.
     */
    lifespan?: number;

    /**
     * The timeout to destroy this entity after the lifespan expires.
     * Timeout types are a bit weird in TS...
     * https://stackoverflow.com/questions/45802988/typescript-use-correct-version-of-settimeout-node-vs-window
     */
    lifespanTimeout?: NodeJS.Timeout;

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
     * Whether this entity is currently blocking the low/high of this tile.
     */
    isBlocking = true;

    /**
     * Whether this entity is capable of moving at all.
     * Things that can move: Players and most creatures.
     * Things that can not move: Walls, doors, rocks, trees (including tree-type NPCs), item pickups.
     */
    static baseMoveRate?: number = undefined;

    /**
     * How often this entity moves, in ms.
     */
    protected moveRate?: number;

    moveLoop?: NodeJS.Timeout;

    static baseMaxHitPoints?: number = undefined;

    maxHitPoints?: number;

    hitPoints?: number;

    static damageTypeImmunities?: Array<DamageTypes> = undefined;

    curse?: Curse;

    enchantment?: Enchantment;

    statusEffects?: {[key: string]: StatusEffect};

    /**
     * The list of actions that this entity type can pick from.
     * For creatures, this will mostly be combat actions, but players can have other ones with more
     * player specific functionality.
     */
    static actions?: Array<string> = undefined;

    actionTimeout?: NodeJS.Timeout;

    static baseGloryValue?: number = undefined;

    gloryValue?: number;

    static baseDefence?: number = undefined;

    defence?: number;

    // static faction?: number = undefined;

    static craftingStationClass?: string = undefined;

    constructor(config: EntityConfig) {
        this.id = idCounter.getNext();

        this.row = config.row;

        this.col = config.col;

        this.board = config.board;

        // Need to mess around a bit to get the values of any subclass properties that have been overridden.
        // For instance, Entity.baseMaxHitPoints would be undefined, but any subclass may then define baseMaxHitPoints.
        // Since we don't know the class where it was defined we can't just get the static properties from it directly,
        // so deduce the class from the constructor of the instance.
        const EntityType = this.constructor as typeof Entity;

        // If a tile is high blocked, then it must also be low blocked.
        if (EntityType.highBlocking === true) {
            EntityType.lowBlocking = true;
        }

        this.isBlocking = true;

        if(EntityType.baseLifespan) {
            this.lifespan = EntityType.baseLifespan;
            this.lifespanTimeout = setTimeout(this.destroy.bind(this), this.lifespan);
        }

        if(EntityType.baseMaxHitPoints) {
            this.maxHitPoints = EntityType.baseMaxHitPoints;
            this.hitPoints = this.maxHitPoints;
        }

        if(EntityType.baseGloryValue) {
            this.gloryValue = EntityType.baseGloryValue;
        }

        this.board.addEntity(this);
    }

    static registerEntityType() {
        this.typeNumber = typeNumberCounter.getNext();
    }

    /**
     * Remove this entity from the game world completely, and allow it to be GCed.
     * Any specific destruction functionality should be added to onDestroy, which is called from this method.
     */
    destroy() {
        // Prevent multiple destruction of entities.
        if (this.destroyed === true) return;

        this.destroyed = true;

        this.onDestroy();
    }

    /**
     * Specific destruction functionality. If overridden, should still be chained from the overrider up to this.
     */
    onDestroy() {
        // Stop all status effects, otherwise they can keep being damaged, and
        // potentially die multiple times while already dead, or be healed and revived.
        this.removeStatusEffects();

        // Make sure this entity is marked as dead, so anything that is targeting it will stop doing so.
        this.hitPoints = -1;

        if(this.lifespanTimeout) {
            clearTimeout(this.lifespanTimeout);
        }

        if(this.actionTimeout) {
            clearTimeout(this.actionTimeout);
        }

        if (this.curse) this.curse.remove();
        if (this.enchantment) this.enchantment.remove();

        // Tell players around this entity to remove it.
        this.board?.emitToNearbyPlayers(this.row, this.col, 'remove_entity', this.id);

        this.board?.removeEntity(this);

        // Remove the reference to the board it was on (that every entity has), so it can be
        // cleaned up if the board is to be destroyed.
        this.board = undefined;
    }

    /**
     * Get all of the properties of this entity that can be emitted to clients.
     * This method should be overridden on each subclass (and any further subclasses), and
     * then called on the superclass of every subclass, calling it's way back up to Entity.
     * So if Player.getEmittableProperties is called, it adds the relevant properties from Player, then
     * any parent classes, and so on until Entity, then returns the result back down the stack.
     * @param properties The properties of this entity that have been added so far. If this is the start of the chain, pass in an empty object.
     */
    getEmittableProperties(properties: ObjectOfUnknown) {
        properties.id = this.id;
        properties.typeNumber = (this.constructor as typeof Entity).typeNumber;
        properties.row = this.row;
        properties.col = this.col;
        properties.hitPoints = this.hitPoints;
        properties.maxHitPoints = this.maxHitPoints;
        return properties;
    }

    /**
     * Returns the board tile this entity is currently occupying.
     * Shouldn't have to worry about the tile being valid, as they shouldn't be occupying an invalid tile.
     */
    getBoardTile() {
        return this.board?.grid[this.row][this.col];
    }

    /**
     * Move this entity from the current board to another one.
     * @param fromBoard - The board the entity is being moved from.
     * @param toBoard - The board to move the entity to.
     * @param toRow - The board grid row to reposition the entity to.
     * @param toCol - The board grid col to reposition the entity to.
     */
    changeBoard(fromBoard: Board | undefined, toBoard: Board, toRow: number, toCol: number) {
        // Need to check if there is a board, as the board reference will be removed if the entity dies, but might be revivable (i.e. players).
        if (fromBoard) {
            // Tell players around this entity on the previous board to remove it.
            fromBoard.emitToNearbyPlayers(
                this.row,
                this.col,
                'remove_entity',
                this.id,
            );

            // Remove this entity from the board it is currently in before adding to the next board.
            // Don't use Entity.reposition as that would only move it around on the same board, not between boards.
            fromBoard.removeEntity(this);
        }

        this.board = toBoard;
        this.row = toRow;
        this.col = toCol;

        this.board.addEntity(this);

        // Tell players around this entity on the new board to add it.
        this.board.emitToNearbyPlayers(
            this.row,
            this.col,
            'add_entity',
            this.getEmittableProperties({}),
        );
    }

    /**
     * When finished constructing this entity, use this to tell the nearby players to add this entity.
     */
    emitToNearbyPlayers() {
        // Tell all players around this one (including itself) that this one has joined.
        this.board?.emitToNearbyPlayers(
            this.row,
            this.col,
            'add_entity',
            this.getEmittableProperties({}),
        );
        return this;
    }

    /**
     * Change the hitpoints value of this entity, if it has the hitpoints property set (not undefined).
     * Calls onDamage or onHeal based on the amount, and also onModHitPoints.
     * @param hitPointModifier An object that details how much to increase or decrease the HP by.
     * @param source The entity that caused this change.
     */
    modHitPoints(hitPointModifier: Damage|Heal, source?: Entity) {
        // Make it impossible to change the HP if this entity is destroyed.
        if (this.destroyed === true) return;

        // Make sure this is a damagable entity.
        if (this.hitPoints === undefined) return;

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
        if(this.hitPoints === undefined) return;
        if(this.maxHitPoints === undefined) return;

        const amount = Math.floor(heal.amount);

        const original = this.hitPoints;

        this.hitPoints += amount;

        // Make sure they can't go above max HP.
        if (this.hitPoints > this.maxHitPoints) {
            this.hitPoints = this.maxHitPoints;
        }

        const difference = this.hitPoints - original;

        this.board?.emitToNearbyPlayers(
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
        if(this.hitPoints === undefined) return;

        damage.amount = Math.floor(damage.amount);
        this.hitPoints -= damage.amount;

        // Check if this entity is destroyed.
        if (this.hitPoints <= 0) {
            this.onAllHitPointsLost();
        }
        // Entity is still alive. Tell nearby players.
        else {
            this.board?.emitToNearbyPlayers(
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
    onAllHitPointsLost() {
        if(this.board) {
            if (this.curse) {
                // If should keep processing after curse has fired, create a corpse.
                if (this.curse.onEntityDeath() === true) {
                    // If this entity has a corpse type, create a new corpse of the specified type.
                    // if (this.CorpseType) {
                    //     new this.CorpseType({
                    //         row: this.row,
                    //         col: this.col,
                    //         board: this.board,
                    //     }).emitToNearbyPlayers();
                    // }
                }
            }
            // No curse. Just create the corpse.
            // else if (this.CorpseType) {
            //     new this.CorpseType({
            //         row: this.row,
            //         col: this.col,
            //         board: this.board,
            //     }).emitToNearbyPlayers();
            // }
        }

        // Destroy this entity.
        this.destroy();

        return;
    }

    /**
     * This entity has had its hitpoints changed.
     * If overridden, should still be chained from the overrider up to this.
     */
    onModHitPoints() { return; }

    modDefence(amount: number) {
        if(this.defence === undefined) return;

        this.defence += amount;
    }

    preMove() { return; }

    /**
     * Moves this entity along the board relative to its current position.
     * To directly change the position of an entity, use Entity.reposition.
     * @param byRows - How many rows to move along by. +1 to move down, -1 to move up.
     * @param byCols - How many cols to move along by. +1 to move right, -1 to move left.
     */
    move(byRows: Offset, byCols: Offset) {
        const origRow = this.row;
        const origCol = this.col;

        // Only let an entity move along a row OR a col, not both at the same time or they can move diagonally through things.
        if(byRows && byCols) return false;

        const currentBoard = this.board;

        const nextBoardTile = currentBoard?.getTileAt(this.row + byRows, this.col + byCols);

        if(!nextBoardTile) return false;

        // Check path isn't blocked.
        if (nextBoardTile.isLowBlocked() === true) return false;

        // Check if the next tile can be stood on.
        if (nextBoardTile.groundType.canBeStoodOn === false) return false;

        this.reposition(this.row + byRows, this.col + byCols);

        if(!this.board) return false;

        // Tell the players in this zone that this dynamic has moved.
        this.board.emitToNearbyPlayers(
            origRow,
            origCol,
            'moved',
            {
                id: this.id,
                row: this.row,
                col: this.col,
                moveRate: this.getMoveRate(),
            },
        );

        // Only the players that can already see this dynamic will move it, but for ones that this has just come in range of, they will
        // need to be told to add this entity, so tell any players at the edge of the view range in the direction this entity moved.
        this.board.emitToPlayersAtViewRange(
            this.row,
            this.col,
            rowColOffsetToDirection(byRows, byCols),
            'add_entity',
            this.getEmittableProperties({}),
        );
        // Thought about making a similar, but separate, function to emitToPlayersAtViewRange that only calls getEmittableProperties
        // if any other players have been found, as the current way calls it for every move, even if there is nobody else seeing it,
        // but it doesn't seem like it would make much difference, as it would still need to get the props for every tile that another
        // player is found on, instead of just once and use it if needed.

        // Cancel any action if one is in progress.
        if(this.actionTimeout) {
            clearTimeout(this.actionTimeout);
            this.actionTimeout = undefined;
        }

        this.postMove();

        return true;
    }

    /**
     * Can be overridden in a subclass to run any extra functionality after this entity has successfully moved.
     */
    postMove() { return; }

    /**
     * Changes the position of this entity on the board it is on.
     * @param toRow - The board grid row to reposition the entity to.
     * @param toCol - The board grid col to reposition the entity to.
     */
    reposition(toRow: number, toCol: number) {
        if(!this.board) return;

        // Remove this entity from the tile it currently occupies on the board.
        this.board.removeEntity(this);

        this.row = toRow;
        this.col = toCol;

        // Add the entity to the tile it is now over on the board.
        this.board.addEntity(this);
    }

    /**
     * Returns the effective move rate of this entity.
     * i.e. apply environmental effects that slow down, enchantments that speed up.
     * Can be overridden to apply move rate modifiers within different subclasses.
     * If overridden, should still be chained from the overrider up to this.
     * @param chainedMoveRate - If this method has been overridden, a value can be passed
     *      in here for what the value so far is.
     * @returns The effective move rate.
     */
    getMoveRate(chainedMoveRate?: number): number {
        let moveRate = chainedMoveRate || this.moveRate || 0;

        if(this.statusEffects) {
            // Check for any status effects that modify the move rate.
            Object.values(this.statusEffects).forEach((statusEffect) => {
                moveRate *= statusEffect.moveRateModifier;
            });
        }

        return moveRate;
    }

    addStatusEffect(StatusEffectClass: typeof StatusEffect, source: Entity) {
        if(!this.statusEffects) this.statusEffects = {};

        new StatusEffectClass(this, source);
    }

    removeStatusEffects() {
        if(this.statusEffects === undefined) return;

        Object.values(this.statusEffects).forEach((statusEffect) => statusEffect.stop());

        delete this.statusEffects;
    }

    dropItems() { return; }

    performAction(actionName: string, entity?: Entity, row?: number, col?: number) {
        if(this.actionTimeout) {
            // Cancel any in-progress action before starting this one
            clearTimeout(this.actionTimeout);
            // Empty the property in case it doesn't get set again below.
            this.actionTimeout = undefined;
        }

        const action = ActionsList[actionName];
        if(!action) return;

        // Check if it is a entity targetted action.
        if(entity) {
            this.startAction(action, undefined, entity);
        }
        // Check if it is a position targetted action.
        else if(row && col) {
            const boardTile = this.board?.getTileAt(row, col);
            if(!boardTile) return;

            this.startAction(action, { row, col });
        }
        // Must be a non-targetted or self-targetted action.
        else {
            this.startAction(action);
        }

        // Tell the clients to start the action on this entity, so they can show the telegraph for it.
        this.board?.emitToNearbyPlayers(
            this.row,
            this.col,
            'start_action',
            {
                id: this.id,
                actionName: action.name,
                duration: action.duration,
            },
        );
    }

    startAction(action: Action, targetPosition?: RowCol, targetEntity?: Entity) {
        this.actionTimeout = setTimeout(
            () => {
                action.run(this, targetPosition, targetEntity, action.config);
                // Action is over, so clear the reference to it doesn't block anything.
                this.actionTimeout = undefined;
            },
            action.duration,
        );
    }

    getDirectionToPosition(position: RowCol) {
        const rowDist = this.row - position.row;
        const colDist = this.col - position.col;

        // Prefer which one has the greatest magnitude.

        // Further away vertically.
        if(Math.abs(rowDist) > Math.abs(colDist)) {
            // Is above.
            if(rowDist > 0) {
                return Directions.UP;
            }
            // Is below.
            else if(rowDist < 0) {
                return Directions.DOWN;
            }
        }
        // Further away horizontally.
        else if(Math.abs(rowDist) < Math.abs(colDist)) {
            // Is left.
            if(colDist > 0) {
                return Directions.LEFT;
            }
            // Is right.
            else if(colDist < 0) {
                return Directions.RIGHT;
            }
        }
        // Same distance both ways. Pick one at random.
        else {
            // Vertically.
            if(Math.random() < 0.5) {
                // Is above.
                if(rowDist > 0) {
                    return Directions.UP;
                }
                // Is below.
                else if(rowDist < 0) {
                    return Directions.DOWN;
                }
            }
            // Horizontally.
            else {
                // Is left.
                if(colDist > 0) {
                    return Directions.LEFT;
                }
                // Is right.
                else if(colDist < 0) {
                    return Directions.RIGHT;
                }
            }
        }

        // They must be on top of each other.
        // Pick a random direction so they have something to work with.
        return getRandomElement(DirectionsValues);
    }
}

export default Entity;
