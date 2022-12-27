import {
    DirectionsPermutationsAsRowColOffsets, Offset, RowCol, RowColOffsetsByDirection,
} from '@rogueworld/types';
import { getRandomElement, getRandomIntInclusive, tileDistanceBetween } from '@rogueworld/utils';
import Damage from '../../gameplay/Damage';
import Drop from '../../gameplay/Drop';
import { FactionRelationshipStatuses, getFactionRelationship } from '../../gameplay/Factions';
import { ItemState } from '../../inventory';
import Entity, { EntityConfig } from './Entity';
import Player from './Player';

class Dynamic extends Entity {
    static serverOnly = true;

    /**
     * The other entity that this entity is trying to do something with.
     * i.e. mob to attack, item to pick up, object to interact with.
     */
    private target?: Entity;

    static targetSearchRate?: number = undefined;

    private targetSearchLoop?: NodeJS.Timeout;

    /**
     * How often (in ms) this entity looks for a new position within the wander range to wander
     * towards.
     * Lower is more often.
     */
    static baseWanderRate?: number = undefined;

    wanderLoop?: NodeJS.Timeout;

    /**
     * How far this entity will wander the next time it does so. Somewhere between 1 tile, and it's
     * view range.
     * Changes each time it wanders, so it doesn't just move the same distance each time.
     */
    wanderTargetPosition?: RowCol;

    /**
     * How far away the target needs to be for this entity to start targeting it, and any further
     * away before this entity stops targeting it.
     * Also used for the max wander distance per wander.
     */
    static viewRange?: number = undefined;

    /**
     * How far away this entity can attack another entity from.
     */
    static baseAttackRange?: number = undefined;

    /**
     * An array of pickups that could be created when this entity is destroyed.
     */
    static dropList: Array<Drop> = [];

    attackRange?: number;

    constructor(config: EntityConfig) {
        super(config);

        const EntityType = this.constructor as typeof Dynamic;

        // Start the loops. Loops are disabled if their rate is 0.
        if (EntityType.baseMoveRate) {
            this.moveRate = EntityType.baseMoveRate;

            this.moveLoop = setTimeout(
                this.move.bind(this),
                this.moveRate + getRandomIntInclusive(0, this.moveRate),
            );
        }

        if (EntityType.baseWanderRate) {
            this.wanderLoop = setTimeout(
                this.wander.bind(this),
                EntityType.baseWanderRate + getRandomIntInclusive(0, EntityType.baseWanderRate),
            );
        }

        if (EntityType.baseAttackRange) {
            this.attackRange = EntityType.baseAttackRange;
        }

        if (EntityType.targetSearchRate) {
            if (EntityType.targetSearchRate > 0) {
                this.targetSearchLoop = setTimeout(
                    this.getNearestHostile.bind(this),
                    EntityType.targetSearchRate
                    + getRandomIntInclusive(0, EntityType.targetSearchRate),
                );
            }
        }
    }

    onDestroy() {
        clearTimeout(this.targetSearchLoop);

        super.onDestroy();
    }

    move() {
        if (!this.board) return false;

        if (this.moveLoop) {
            // Prevent multiple move loops from being created if this move function is called again.
            clearTimeout(this.moveLoop);
            this.moveLoop = setTimeout(this.move.bind(this), this.getMoveRate());
        }

        this.onMove();

        return true;
    }

    onMove() {
        if (this.target) {
            // If the target is out of view range, forget about them.
            if (!this.isEntityWithinViewRange(this.target)) {
                this.setTarget();
                return;
            }

            // If they are on the same tile, try to move apart.
            if (this.row === this.target.row && this.col === this.target.col) {
                // Don't move if doing an action, or it will interrupt itself.
                if (this.actionTimeout) return;

                this.moveAwayFromCurrentTile();
                return;
            }

            // If the target is out of the attack range, move closer.
            if (!this.isEntityWithinAttackRange(this.target)) {
                // Check to see if there are any closer hostiles to attack instead.
                const potentialTarget = this.getNearestHostile();

                // Check if the closest hostile is already the current target.
                if (potentialTarget && potentialTarget !== this.target) {
                    this.setTarget(potentialTarget);
                    // Found a closer hostile, stop moving closer to the current target.
                    return;
                }

                const offset = RowColOffsetsByDirection[
                    this.getDirectionToPosition(this.target)
                ];

                // Check if there is a damaging tile in front.
                if (!this.checkForMoveHazards(offset.row, offset.col)) return;

                // Don't move if doing an action, or it will interrupt itself.
                if (this.actionTimeout) return;

                super.move(offset.row, offset.col);
            }
            // Target is within attack range, attack them.
            // Don't attempt to attack while they are already doing something.
            else if (!this.actionTimeout) {
                // Target already dead, forget about them.
                if (!this.target.board) {
                    this.setTarget();
                    return;
                }

                // Use one of their available actions.
                const EntityType = this.constructor as typeof Entity;
                if (!EntityType.actions) return;

                this.performAction(
                    getRandomElement(EntityType.actions),
                    this.target,
                );
            }
        }
        // No target, wander around.
        else if (this.wanderTargetPosition) {
            // If still too far away, move closer.
            if (tileDistanceBetween(this.wanderTargetPosition, this) > 1) {
                const offset = RowColOffsetsByDirection[
                    this.getDirectionToPosition(this.wanderTargetPosition)
                ];
                // Check if there is a damaging tile in front.
                if (!this.checkForMoveHazards(offset.row, offset.col)) return;

                super.move(offset.row, offset.col);
            }
        }
    }

    /**
     * Move this entity away from the tile it is on. Tries each direction in a random order.
     */
    moveAwayFromCurrentTile() {
        if (!this.board) return;

        const { row, col } = this;
        const { grid } = this.board;

        // Get a randomised set of directions to try to move in.
        const randomDirectionOffsets = getRandomElement(
            DirectionsPermutationsAsRowColOffsets,
        );

        randomDirectionOffsets.some((offsets) => {
            // Check if any of the directions are not blocked.
            if (grid[row + offsets.row][col + offsets.col].isLowBlocked() === false) {
                super.move(offsets.row, offsets.col);
                return true;
            }
            return false;
        });
    }

    checkForMoveHazards(byRows: Offset, byCols: Offset) {
        // Check the grid row element being accessed is valid.
        if (!this.board?.grid[this.row + byRows]) return false;

        /** @type {BoardTile} */
        const boardTile = this.board.getTileAt(this.row + byRows, this.col + byCols);

        // Check the grid col element (the tile itself) being accessed is valid.
        if (!boardTile) return false;

        if (boardTile.groundType.hazardous) return false;

        return true;
    }

    /**
     * Find somewhere else for this entity to move to.
     * Changes to a random direction, and sets a random distance to travel.
     */
    wander() {
        const EntityType = this.constructor as typeof Dynamic;

        // Make sure the loop continues before doing anything else.
        this.wanderLoop = setTimeout(
            this.wander.bind(this),
            (EntityType.baseWanderRate || 10000)
            + getRandomIntInclusive(0, (EntityType.baseWanderRate || 10000)),
        );

        // Don't wander if a target is set.
        if (this.target) return;

        // Get a random position within their view range to use as their new wander target.
        const viewRange = EntityType.viewRange || 0;
        const rowOffset = getRandomIntInclusive(-viewRange, viewRange);
        const colOffset = getRandomIntInclusive(-viewRange, viewRange);

        this.wanderTargetPosition = { row: this.row + rowOffset, col: this.col + colOffset };
    }

    onDamage(damage: Damage, damagedBy?: Entity) {
        if (damagedBy instanceof Player) {
            this.setTarget(damagedBy);
        }
        else if (damagedBy instanceof Entity) {
            // // Check the faction relationship for if to target the attacker or not.
            // // If damaged by a friendly entity, ignore the damage.
            // if (getFactionRelationship(
            //     this.faction,
            //     damagedBy.faction,
            // ) === FactionRelationshipStatuses.Friendly) {
            //     return;
            // }
            // // Damaged by a hostile or neutral entity, target it.

            // this.setTarget();
        }

        // this.lastDamagedTime = Date.now();

        super.onDamage(damage, damagedBy);
    }

    onAllHitPointsLost() {
        if (this.board) {
            // Give all nearby players the glory value of this entity.
            const nearbyPlayers = this.board.getNearbyPlayers(this.row, this.col, 7);

            if (this.gloryValue) {
                for (let i = 0; i < nearbyPlayers.length; i += 1) {
                    nearbyPlayers[i].modGlory(+this.gloryValue);
                    // nearbyPlayers[i].tasks.progressTask(this.taskIdKilled);
                }
            }

            this.dropItems();
        }

        super.onAllHitPointsLost();
    }

    /**
     * Create some pickups for whatever this entity has dropped from its drop list.
     */
    dropItems() {
        const EntityType = this.constructor as typeof Dynamic;

        EntityType.dropList.forEach((dropConfig) => {
            if (!this.board) return;

            // Roll for this drop as many times as it is configured to.
            for (let roll = 0; roll < dropConfig.rolls; roll += 1) {
                // Do the roll.
                if (dropConfig.dropRate >= getRandomIntInclusive(1, 100)) {
                    // Create a new pickup which will be added to the board.
                    new dropConfig.PickupType({
                        row: this.row,
                        col: this.col,
                        board: this.board,
                        itemState: new ItemState({
                            ItemType: dropConfig.PickupType.ItemType,
                            quantity: dropConfig.quantity,
                        }),
                    }).emitToNearbyPlayers();
                }
            }
        });
    }

    /**
     * Is the entity within the view range of this entity, in any direction.
     */
    isEntityWithinViewRange(entity: Entity) {
        const EntityType = this.constructor as typeof Dynamic;
        if (Math.abs(this.col - entity.col) >= (EntityType.viewRange || 0)) return false;
        if (Math.abs(this.row - entity.row) >= (EntityType.viewRange || 0)) return false;
        return true;
    }

    isEntityWithinAttackRange(entity: Entity) {
        return tileDistanceBetween(this, entity) <= (this.attackRange || 0);
    }

    /**
     * Sets the target of this entity to the target entity.
     * Pass in nothing to clear the target.
     */
    setTarget(entity?: Entity) {
        this.target = entity || undefined;
    }

    /**
     * Gets the nearest entity to this entity that it considers hostile, according to it's faction
     * status.
     */
    getNearestHostile() {
        const EntityType = this.constructor as typeof Dynamic;
        const { viewRange } = EntityType;

        if (!viewRange) return null;

        let rowOffset = -viewRange;
        let colOffset = -viewRange;
        const viewRangePlusOne = viewRange + 1;
        let gridRow;
        let entityKey: string;
        let distBetween: number;
        let nearestDist = viewRangePlusOne;
        let nearestEntity: Entity | null = null;

        // Search all tiles within the view range to find a target.
        for (; rowOffset < viewRangePlusOne; rowOffset += 1) {
            gridRow = this.board?.grid[this.row + rowOffset];

            // Check the row is valid.
            // eslint-disable-next-line no-continue
            if (gridRow === undefined) continue;

            for (colOffset = -viewRange; colOffset < viewRangePlusOne; colOffset += 1) {
                // Check the col is valid.
                // eslint-disable-next-line no-continue
                if (gridRow[this.col + colOffset] === undefined) continue;

                const { entities } = gridRow[this.col + colOffset];

                // eslint-disable-next-line no-restricted-syntax
                for (entityKey in entities) {
                    // eslint-disable-next-line no-continue
                    if (!Object.hasOwn(entities, entityKey)) continue;

                    // TODO: if using this function again, check the isHostileToCharacter faction.
                    const entity = entities[entityKey] as Dynamic;

                    // Check this entity is hostile towards the other entity.
                    if (getFactionRelationship(this.faction, entity.faction)
                    === FactionRelationshipStatuses.Hostile) {
                        distBetween = (
                            Math.abs(this.col - entity.col)
                            + Math.abs(this.row - entity.row)
                        );
                        // If it is closer than any other hostile found so far, make it the new
                        // closest.
                        if (distBetween < nearestDist) {
                            nearestDist = distBetween;
                            nearestEntity = entity;
                            // Stop checking other dynamics in this board tile, as a nearest has
                            // already been found here, and any other hostiles found would be the
                            // same distance.
                            break;
                        }
                    }
                }
            }
        }

        return nearestEntity;
    }
}

export default Dynamic;
