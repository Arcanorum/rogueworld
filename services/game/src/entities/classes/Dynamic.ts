import { Offset, RowCol, RowColOffsetsByDirection } from '@dungeonz/types';
import { getRandomIntInclusive } from '@dungeonz/utils';
import Entity, { EntityConfig } from './Entity';

class Dynamic extends Entity {
    /**
     * The other entity that this entity is trying to do something with.
     * i.e. mob to attack, item to pick up, object to interact with.
     */
    target?: Entity;

    /**
     * How often (in ms) this mob looks for a new position within the wander range to wander towards.
     * Lower is more often.
     */
    static baseWanderRate?: number = undefined;

    wanderLoop?: NodeJS.Timeout;

    /**
     * How far this entity will wander the next time it does so. Somewhere between 1 tile, and it's view range.
     * Changes each time it wanders, so it doesn't just move the same distance each time.
     */
    wanderTargetPosition?: RowCol;

    /**
     * How far away the target needs to be for this mob to start targeting it, and any further away before this mob stops targeting it.
     * Also used for the max wander distance per wander.
     */
    static viewRange?: number = undefined;

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
    }

    move() {
        if (!this.board) return false;

        if(this.moveLoop) {
            // Prevent multiple move loops from being created if this move function is called again.
            clearTimeout(this.moveLoop);
            this.moveLoop = setTimeout(this.move.bind(this), this.getMoveRate());
        }

        this.onMove();

        return true;
    }

    onMove() {
        // No target, wander around.
        if (!this.target) {
            if(this.wanderTargetPosition) {
                const offset = RowColOffsetsByDirection[
                    this.getDirectionToPosition(this.wanderTargetPosition)
                ];
                // Check if there is a damaging tile in front.
                if (!this.checkForMoveHazards(offset.row, offset.col)) return false;

                super.move(offset.row, offset.col);
            }
        }
        else {
            // // If the target is out of view range, forget about them.
            // if (this.isEntityWithinViewRange(this.target) === false) {
            //     this.target = null;
            //     return;
            // }
            // // If they are on the same tile, try to move apart.
            // if (this.row === this.target.row && this.col === this.target.col) {
            //     this.moveAwayFromCurrentTile();
            //     return;
            // }

            // // If the target is out of the attack line, move closer.
            // if (this.isEntityWithinAttackLine(this.target) === false) {
            //     this.moveTowardsEntity(this.target);
            // }
        }
    }

    checkForMoveHazards(byRows: Offset, byCols: Offset) {
        // Check the grid row element being accessed is valid.
        if (!this.board?.grid[this.row + byRows]) return false;

        /** @type {BoardTile} */
        const boardTile = this.board.grid[this.row + byRows][this.col + byCols];

        // Check the grid col element (the tile itself) being accessed is valid.
        if (!boardTile) return false;

        if (boardTile.groundType.hazardous) return false;

        return true;
    }

    /**
     * Find somewhere else for this mob to move to.
     * Changes to a random direction, and sets a random distance to travel.
     */
    wander() {
        const EntityType = this.constructor as typeof Dynamic;

        this.wanderLoop = setTimeout(
            this.wander.bind(this),
            (EntityType.baseWanderRate || 10000)
            + getRandomIntInclusive(0, (EntityType.baseWanderRate || 10000)),
        );

        // Don't wander if a target is set.
        if (this.target) return;

        // Get a random position within their view range to use as their new wander target.
        if (!EntityType.viewRange) return;
        const rowOffset = getRandomIntInclusive(-EntityType.viewRange, EntityType.viewRange);
        const colOffset = getRandomIntInclusive(-EntityType.viewRange, EntityType.viewRange);

        this.wanderTargetPosition = { row: this.row + rowOffset, col: this.col + colOffset };
    }
}

export default Dynamic;
