import { Settings } from '@rogueworld/configs';
import {
    Directions,
    DirectionsValues,
    EntityCategories,
    ObjectOfUnknown,
    Offset,
    RowCol,
    RowColOffsetsByDirection,
    SpriteConfig,
} from '@rogueworld/types';
import { Counter, getRandomElement, getRandomIntInclusive } from '@rogueworld/utils';
import { createEntityDocument, deleteEntityDocument, updateEntityDocument } from '../../database';
import { EntityDocument, SavableEntityProperties } from '../../database/entity/EntityModel';
import Action from '../../gameplay/actions/Action';
import ActionsList from '../../gameplay/actions/ActionsList';
import Damage from '../../gameplay/Damage';
import DamageTypes from '../../gameplay/DamageTypes';
import { rowColOffsetToDirection } from '../../gameplay/Directions';
import Factions from '../../gameplay/Factions';
import Heal from '../../gameplay/Heal';
import { Curse, Enchantment } from '../../gameplay/magic_effects';
import { StatusEffect } from '../../gameplay/status_effects';
import Board from '../../space/Board';
import { Populator } from '../../space/PopulationManager';

const idCounter = new Counter();
const typeNumberCounter = new Counter();

export interface EntityConfig {
    row: number;
    col: number;
    board: Board;
    spawnedBy?: Entity | Populator;
    documentId?: string;
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
     * A type number is an ID for all entities that appear on the client, so the client knows which
     * entity to add.
     * Used to send a number to get the entity name from the entity type catalogue, instead of a
     * lengthy string of the entity name.
     * All entities that appear on the client must be registered with
     * ENTITYCLASS.registerEntityType().
     */
    static typeNumber: number;

    /**
     * The unique identifier of this type of entity. Should be set in the entity values list and
     * never changed, as changing this would invalidate the data saved in the DB for persistent
     * entities of this type.
     */
    static typeCode?: string = undefined;

    /**
     * Class name of this entity type. Useful for debugging. Don't save this anywhere as it may
     * change if the entity gets renamed. Use typeCode instead for persistence.
     */
    static typeName: string;

    /**
     * Any configs that need to be passed to the entity types list for the game client to use when
     * setting up the sprite classes.
     */
    static clientConfig: SpriteConfig = {};

    /**
     * Whether this entity has had it's destroy method called, and is just waiting to be GCed, so
     * shouldn't be usable any more.
     */
    protected destroyed = false;

    /**
     * For persistent entity types, this is the Mongo document ID for the stored data for this
     * entity.
     */
    documentId?: string;

    /**
     * A loop that periodically updates the state of this entity in the DB. State changes between
     * loops will be lost when the server stops.
     */
    documentUpdateLoop?: NodeJS.Timeout;

    /**
     * For persistent entity types, this is the set of most recently saved values for each of the
     * properties that are to be persisted with this entity.
     * Used to compare changes in state when considering whether to update the document for this
     * entity in the DB.
     */
    mostRecentSavablePropertyValues?: SavableEntityProperties;

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
     * Things that can not move: Walls, doors, rocks, trees (including tree-type NPCs), item
     * pickups.
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

    statusEffects?: { [key: string]: StatusEffect };

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

    static baseFaction = Factions.Naturals;

    faction: number;

    static craftingStationClass?: string = undefined;

    static categories?: Array<EntityCategories> = undefined;

    /**
     * CONFIG ONLY PROPERTY, DOESN'T ACTUALLY EXIST ON CLASS AT RUNTIME.
     * This property only exists here to please the type checker and the entities loader.
     * See EntitiesLoader for explanation.
     * Which ground types this entity type can be spawned onto.
     * e.g. An ice elemental should only spawn on snow tiles.
     */
    static spawnGroundTypes? = undefined;

    /**
     * CONFIG ONLY PROPERTY, DOESN'T ACTUALLY EXIST ON CLASS AT RUNTIME.
     * This property only exists here to please the type checker and the entities loader.
     * See EntitiesLoader for explanation.
     * Which category of spawnable entities this entity type falls into.
     * e.g. Both iron rocks and dungium rocks are both metal ore nodes, so they are grouped under
     * the oreRocks category.
     */
    static spawnCategory? = undefined;

    /**
     * A reference to the thing (other entity, populator, whatever) that created this entity.
     * Useful for doing cleanup logic that involves the creator.
     */
    spawnedBy?: Entity | Populator = undefined;

    /**
     * The type of entity this entity will transform into, after some criteria, usually after a
     * timer (see `Entity.transformactionTimer`).
     */
    static TransformationEntityType?: typeof Entity = undefined;

    /**
     * How long this entity will last for before it transforms into another type of entity, as
     * defined by `Entity.TransformationEntityType`.
     */
    static transformationTimer?: number = undefined;

    /**
     * Whether this entity will cause any kind of obstruction to anything on
     * top of it, such as a door trying to close.
     */
    static isFlooring?: boolean = undefined;

    constructor(config: EntityConfig) {
        this.id = idCounter.getNext();

        this.row = config.row;

        this.col = config.col;

        this.board = config.board;

        this.spawnedBy = config.spawnedBy;

        // Need to mess around a bit to get the values of any subclass properties that have been
        // overridden.
        // For instance, Entity.baseMaxHitPoints would be undefined, but any subclass may then
        // define baseMaxHitPoints.
        // Since we don't know the class where it was defined we can't just get the static
        // properties from it directly,
        // so deduce the class from the constructor of the instance.
        const EntityType = this.constructor as typeof Entity;

        // If a tile is high blocked, then it must also be low blocked.
        if (EntityType.highBlocking === true) {
            EntityType.lowBlocking = true;
        }

        this.isBlocking = true;

        if (EntityType.baseLifespan) {
            this.lifespan = EntityType.baseLifespan;
            this.lifespanTimeout = setTimeout(this.destroy.bind(this), this.lifespan);
        }

        if (EntityType.baseMaxHitPoints) {
            this.maxHitPoints = EntityType.baseMaxHitPoints;
            this.hitPoints = this.maxHitPoints;
        }

        if (EntityType.baseGloryValue) {
            this.gloryValue = EntityType.baseGloryValue;
        }

        this.faction = EntityType.baseFaction;

        // Prevent entities that are spawned by a system from being persisted, otherwise repeated
        // restarts would just keep stacking them, going over any intended max population for that
        // entity category.
        // Also ignore the world tree, as it should be persisted elsewhere, as we can't guarantee
        // there will be room on the board to add it as a regular persisted entity if the world is
        // already full when it tries to add the world tree, if it is too late to be added.
        if (!this.spawnedBy && EntityType.typeCode && EntityType.typeCode !== 'ORNR8756') {
            if (config.documentId) {
                this.startUpdateDocumentLoop(config.documentId);
            }
            else {
                createEntityDocument(
                    {
                        typeCode: EntityType.typeCode,
                        row: this.row,
                        col: this.col,
                        hitPoints: this.hitPoints,
                    },
                    (documentId) => {
                        if (!documentId) return;

                        this.startUpdateDocumentLoop(documentId);
                    },
                );
            }
        }

        if (EntityType.transformationTimer && EntityType.TransformationEntityType) {
            setTimeout(() => {
                if (!this.board) return;
                if (!EntityType.TransformationEntityType) return;

                new EntityType.TransformationEntityType({
                    row: this.row,
                    col: this.col,
                    board: this.board,
                }).emitToNearbyPlayers();

                this.destroy();
            }, EntityType.transformationTimer);
        }

        this.board.addEntity(this);
    }

    static registerEntityType() {
        this.typeNumber = typeNumberCounter.getNext();
    }

    /**
     * Remove this entity from the game world completely, and allow it to be GCed.
     * Any specific destruction functionality should be added to onDestroy, which is called from
     * this method.
     */
    destroy() {
        // Prevent multiple destruction of entities.
        if (this.destroyed === true) return;

        this.destroyed = true;

        this.onDestroy();
    }

    /**
     * Specific destruction functionality. If overridden, should still be chained from the
     * overrider up to this.
     */
    onDestroy() {
        // Stop all status effects, otherwise they can keep being damaged, and potentially die
        // multiple times while already dead, or be healed and revived.
        this.removeStatusEffects();

        // Make sure this entity is marked as dead, so anything that is targeting it will stop
        // doing so.
        this.hitPoints = -1;

        if (this.lifespanTimeout) clearTimeout(this.lifespanTimeout);

        if (this.actionTimeout) clearTimeout(this.actionTimeout);

        if (this.curse) this.curse.remove();

        if (this.enchantment) this.enchantment.remove();

        if (this.spawnedBy) this.spawnedBy.onChildDestroyed();

        // Tell players around this entity to remove it.
        this.board?.emitToNearbyPlayers(this.row, this.col, 'remove_entity', this.id);

        if (this.documentUpdateLoop) clearInterval(this.documentUpdateLoop);

        if (this.documentId) deleteEntityDocument(this.documentId);

        this.board?.removeEntity(this);

        // Remove the reference to the board it was on (that every entity has), so it can be
        // cleaned up if the board is to be destroyed.
        this.board = undefined;
    }

    updateDocument() {
        if (!this.documentId) return;
        if (!this.mostRecentSavablePropertyValues) return;

        // Check for any state that has been modified that should now be saved.
        const dataToUpdate: Partial<EntityDocument> = {};

        if (this.row !== this.mostRecentSavablePropertyValues.row) {
            dataToUpdate.row = this.row;
            this.mostRecentSavablePropertyValues.row = this.row;
        }

        if (this.col !== this.mostRecentSavablePropertyValues.col) {
            dataToUpdate.col = this.col;
            this.mostRecentSavablePropertyValues.col = this.col;
        }

        if (this.hitPoints !== this.mostRecentSavablePropertyValues.hitPoints) {
            dataToUpdate.hitPoints = this.hitPoints;
            this.mostRecentSavablePropertyValues.hitPoints = this.hitPoints;
        }

        // Don't bother if nothing has changed.
        if (Object.keys(dataToUpdate).length < 1) return;

        updateEntityDocument(this.documentId, dataToUpdate);
    }

    startUpdateDocumentLoop(documentId: string) {
        this.documentId = documentId;

        this.mostRecentSavablePropertyValues = {
            row: this.row,
            col: this.col,
            hitPoints: this.hitPoints,
        };

        // Start the loop for this entity to save itself.
        this.documentUpdateLoop = setInterval(
            this.updateDocument.bind(this),
            // Add a bit of random offset between each update loop so if a lot of entities
            // are spawned together (persistent entities loaded from DB on startup) they
            // don't all try to update at the same time.
            (Settings.ENTITY_AUTO_SAVE_RATE || 30000) + getRandomIntInclusive(0, 1000),
        );
    }

    /**
     * Get all of the properties of this entity that can be emitted to clients.
     * This method should be overridden on each subclass (and any further subclasses), and
     * then called on the superclass of every subclass, calling it's way back up to Entity.
     * So if Player.getEmittableProperties is called, it adds the relevant properties from Player,
     * then any parent classes, and so on until Entity, then returns the result back down the stack.
     * @param properties The properties of this entity that have been added so far. If this is the
     * start of the chain, pass in an empty object.
     */
    getEmittableProperties(properties: ObjectOfUnknown) { /* eslint-disable no-param-reassign */
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
     * Shouldn't have to worry about the tile being valid, as they shouldn't be occupying an
     * invalid tile.
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
        // Need to check if there is a board, as the board reference will be removed if the entity
        // dies, but might be revivable (i.e. players).
        if (fromBoard) {
            // Tell players around this entity on the previous board to remove it.
            fromBoard.emitToNearbyPlayers(
                this.row,
                this.col,
                'remove_entity',
                this.id,
            );

            // Remove this entity from the board it is currently in before adding to the next board.
            // Don't use Entity.reposition as that would only move it around on the same board, not
            // between boards.
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
     * When finished constructing this entity, use this to tell the nearby players to add this
     * entity.
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
     * Change the hitpoints value of this entity, if it has the hitpoints property set (not
     * undefined).
     * Calls onDamage or onHeal based on the amount, and also onModHitPoints.
     * @param hitPointModifier An object that details how much to increase or decrease the HP by.
     * @param source The entity that caused this change.
     */
    modHitPoints(hitPointModifier: Damage | Heal, source?: Entity) {
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
        if (this.hitPoints === undefined) return;
        if (this.maxHitPoints === undefined) return;

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
     * Deal damage to this entity. Lowers the hitpoints. Used mainly by weapons and melee mobs when
     * attacking.
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
        if (this.hitPoints === undefined) return;

        let { amount } = damage;

        if (damage.bonuses) {
            // Get the highest applicable damage bonus multiplier.
            // Don't just apply all of them.
            const entityTypeCategories = (this.constructor as typeof Entity).categories;

            let applicableModifiers = 0;
            const totalMultiplier = damage.bonuses.reduce(
                (previousValue, bonus) => {
                    // Check this damage bonus is applicable to any of the categories of this
                    // entity type.
                    if (entityTypeCategories?.some((category) => category === bonus.category)) {
                        applicableModifiers += 1;
                        return previousValue + bonus.multiplier;
                    }
                    return previousValue;
                },
                0,
            );

            if (applicableModifiers > 0) {
                // Use an average of all applied modifier values.
                amount *= (totalMultiplier / applicableModifiers);
            }
        }

        amount = Math.floor(amount);

        // Don't allow negative damage, or things might get weird, and shouldn't be abused to
        // implement a pseudo-healing mechanic.
        if (amount < 0) amount = 0;

        this.hitPoints -= amount;

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
                { id: this.id, amount: -amount },
            );
        }
    }

    /**
     * This entity has been taken to or below 0 hitpoints.
     * If overridden, should still be chained from the overrider up to this.
     */
    onAllHitPointsLost() {
        if (this.board) {
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
    }

    /**
     * This entity has had its hitpoints changed.
     * If overridden, should still be chained from the overrider up to this.
     */
    onModHitPoints() { }

    onChildDestroyed() { }

    modDefence(amount: number) {
        if (this.defence === undefined) return;

        this.defence += amount;
    }

    preMove() { return true; }

    /**
     * Moves this entity along the board relative to its current position.
     * To directly change the position of an entity, use Entity.reposition.
     * @param byRows - How many rows to move along by. +1 to move down, -1 to move up.
     * @param byCols - How many cols to move along by. +1 to move right, -1 to move left.
     */
    move(byRows: Offset, byCols: Offset) {
        if (!this.preMove()) return false;

        const origRow = this.row;
        const origCol = this.col;

        // Only let an entity move along a row OR a col, not both at the same time or they can move
        // diagonally through things.
        if (byRows && byCols) return false;

        const currentBoard = this.board;

        const nextBoardTile = currentBoard?.getTileAt(this.row + byRows, this.col + byCols);

        if (!nextBoardTile) return false;

        // Check if there is an entity there that is interacted with by moving into it (i.e. a
        // door).
        nextBoardTile.getFirstEntity()?.onMovedInto(this);

        // Check path isn't blocked.
        if (nextBoardTile.isLowBlocked()) return false;

        // Check if the next tile can be stood on.
        if (nextBoardTile.groundType.canBeStoodOn === false) return false;

        this.reposition(this.row + byRows, this.col + byCols);

        if (!this.board) return false;

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

        // Only the players that can already see this dynamic will move it, but for ones that this
        // has just come in range of, they will need to be told to add this entity, so tell any
        // players at the edge of the view range in the direction this entity moved.
        this.board.emitToPlayersAtViewRange(
            this.row,
            this.col,
            rowColOffsetToDirection(byRows, byCols),
            'add_entity',
            this.getEmittableProperties({}),
        );
        // Thought about making a similar, but separate, function to emitToPlayersAtViewRange that
        // only calls getEmittableProperties if any other players have been found, as the current
        // way calls it for every move, even if there is nobody else seeing it, but it doesn't seem
        // like it would make much difference, as it would still need to get the props for every
        // tile that another player is found on, instead of just once and use it if needed.

        // Cancel any action if one is in progress.
        if (this.actionTimeout) {
            clearTimeout(this.actionTimeout);
            this.actionTimeout = undefined;
        }

        this.postMove();

        return true;
    }

    /**
     * Can be overridden in a subclass to run any extra functionality after this entity has
     * successfully moved.
     */
    postMove() {
        const boardTile = this.getBoardTile();
        if (!boardTile) return;
        const { groundType } = boardTile;

        // Add the status effect FIRST, in case they die from the damage below, so they
        // don't have status effect while dead, as they should have all been removed.
        if (groundType.statusEffects) {
            groundType.statusEffects.forEach((eachStatusEffect) => {
                this.addStatusEffect(eachStatusEffect, this);
            });
        }

        if (this.statusEffects) {
            Object.values(this.statusEffects).forEach((statusEffect) => {
                statusEffect.onMove();
            });
        }
    }

    onMovedInto(otherEntity: Entity) { }

    /**
     * Changes the position of this entity on the board it is on.
     * @param toRow - The board grid row to reposition the entity to.
     * @param toCol - The board grid col to reposition the entity to.
     */
    reposition(toRow: number, toCol: number) {
        if (!this.board) return;

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

        if (this.statusEffects) {
            // Check for any status effects that modify the move rate.
            Object.values(this.statusEffects).forEach((statusEffect) => {
                moveRate *= statusEffect.moveRateModifier;
            });
        }

        return moveRate;
    }

    addStatusEffect(StatusEffectClass: typeof StatusEffect, source: Entity) {
        if (!this.statusEffects) this.statusEffects = {};

        new StatusEffectClass(this, source);
    }

    removeStatusEffectByName(name: string) {
        if (!this.statusEffects) return;

        delete this.statusEffects[name];
    }

    removeStatusEffects() {
        if (!this.statusEffects) return;

        Object.values(this.statusEffects).forEach((statusEffect) => statusEffect.stop());

        delete this.statusEffects;
    }

    dropItems() { }

    performAction(
        action: Action | string,
        entity?: Entity,
        row?: number,
        col?: number,
        onComplete?: () => void,
    ) {
        if (this.actionTimeout) {
            // Cancel any in-progress action before starting this one
            clearTimeout(this.actionTimeout);
            // Empty the property in case it doesn't get set again below.
            this.actionTimeout = undefined;
        }

        if (typeof action === 'string') {
            action = ActionsList[action];
            if (!action) return;
        }

        // Check if the condition for using this action is met.
        if (action.condition && !action.condition?.(this, undefined, entity, action.config)) return;

        // Check if it is a entity targetted action.
        if (entity) {
            this.startAction(action, undefined, entity, onComplete);
        }
        // Check if it is a position targetted action.
        else if (row && col) {
            const boardTile = this.board?.getTileAt(row, col);
            if (!boardTile) return;

            this.startAction(action, { row, col }, undefined, onComplete);
        }
        // Must be a non-targetted or self-targetted action.
        else {
            this.startAction(action, undefined, undefined, onComplete);
        }

        // Tell the clients to start the action on this entity, so they can show the telegraph for
        // it.
        this.board?.emitToNearbyPlayers(
            this.row,
            this.col,
            'start_action',
            {
                id: this.id,
                actionName: action.name,
                duration: action.duration,
                target: entity?.id,
            },
        );
    }

    checkStartActionCondition(action: Action, targetPosition?: RowCol, targetEntity?: Entity) {
        return (
            action.condition
                ? action.condition(this, targetPosition, targetEntity, action.config)
                : false);
    }

    startAction(
        action: Action,
        targetPosition?: RowCol,
        targetEntity?: Entity,
        onComplete?: () => void,
    ) {
        this.actionTimeout = setTimeout(
            () => {
                if (action.run) action.run(this, targetPosition, targetEntity, action.config);
                // Action is over, so clear the reference to it doesn't block anything.
                this.actionTimeout = undefined;

                if (onComplete) onComplete();
            },
            action.duration,
        );
    }

    getDirectionToPosition(position: RowCol) {
        const rowDist = this.row - position.row;
        const colDist = this.col - position.col;

        // Prefer which one has the greatest magnitude.

        // Further away vertically.
        if (Math.abs(rowDist) > Math.abs(colDist)) {
            // Is above.
            if (rowDist > 0) {
                return Directions.UP;
            }
            // Is below.
            if (rowDist < 0) {
                return Directions.DOWN;
            }
        }
        // Further away horizontally.
        else if (Math.abs(rowDist) < Math.abs(colDist)) {
            // Is left.
            if (colDist > 0) {
                return Directions.LEFT;
            }
            // Is right.
            if (colDist < 0) {
                return Directions.RIGHT;
            }
        }
        // Same distance both ways. Pick one at random.
        // Vertically.
        else if (Math.random() < 0.5) {
            // Is above.
            if (rowDist > 0) {
                return Directions.UP;
            }
            // Is below.
            if (rowDist < 0) {
                return Directions.DOWN;
            }
        }
        // Horizontally.
        else {
            // Is left.
            if (colDist > 0) {
                return Directions.LEFT;
            }
            // Is right.
            if (colDist < 0) {
                return Directions.RIGHT;
            }
        }

        // They must be on top of each other.
        // Pick a random direction so they have something to work with.
        return getRandomElement(DirectionsValues);
    }

    /**
     * Gets a random row & col around this entity within the given range.
     * Useful for spawning entities somewhere around another entity.
     * @param range How far away from this entity to get a position within.
     * @param includeOwnPosition Whether or not to include the position of this entity as a valid
     * position to return. Default false.
     */
    getRandomPositionInRange(range: number, includeOwnPosition = true) {
        let randomRow = this.row + getRandomIntInclusive(-range, +range);
        let randomCol = this.col + getRandomIntInclusive(-range, +range);

        if (!includeOwnPosition) {
            // If it would be on top of this entity, move it up, down, left or right randomly.
            if (randomRow === this.row && randomCol === this.col) {
                const randomOffset = getRandomElement(
                    Object.values(RowColOffsetsByDirection),
                );
                randomRow += randomOffset.row;
                randomCol += randomOffset.col;
            }
        }

        // TODO: check these for validity on the board, might be random and out of bounds.
        return {
            row: randomRow,
            col: randomCol,
        };
    }

    /**
     * Gets all of the row/cols around (as in the square/diameter around it) this entity at the
     * given range.
     */
    getRowColsAtRange(range: number) {
        const rowCols: RowCol[] = [];

        // Top edge.
        const topRow = this.row - range;
        for (let col = -range; col <= range; col += 1) {
            rowCols.push({
                row: topRow,
                col: this.col + col,
            });
        }

        // Bottom edge.
        const bottomRow = this.row + range;
        for (let col = -range; col <= range; col += 1) {
            rowCols.push({
                row: bottomRow,
                col: this.col + col,
            });
        }

        // Since we got the full rows of the top and bottom, we need to exclude those top and
        // bottom rows from the sides, or the corners will be counted twice.
        const rangeMinusOne = range - 1;

        // Left edge.
        const leftCol = this.col - range;
        for (let row = -rangeMinusOne; row <= rangeMinusOne; row += 1) {
            rowCols.push({
                row: this.row + row,
                col: leftCol,
            });
        }

        // Left edge.
        const rightCol = this.col + range;
        for (let row = -rangeMinusOne; row <= rangeMinusOne; row += 1) {
            rowCols.push({
                row: this.row + row,
                col: rightCol,
            });
        }

        // TODO: check these for validity on the board, might be out of bounds.
        return rowCols;
    }
}

export default Entity;
