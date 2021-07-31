const Character = require("../Character");
const Utils = require("../../../../../../Utils");
const EntitiesList = require("../../../../../EntitiesList");
const Player = require("../Player");
const Damage = require("../../../../../../gameplay/Damage");
const ItemConfig = require("../../../../../../inventory/ItemConfig");
const {
    OppositeDirections,
    rowColOffsetToDirection,
    Directions,
    DirectionsPermutationsAsRowColOffsets,
    RowColOffsetsByDirection,
} = require("../../../../../../gameplay/Directions");

class Mob extends Character {
    /**
     * @param {Object} config
     * @param {Number} config.row
     * @param {Number} config.col
     * @param {Board} config.board
     * @param {Number} [config.lifespan] - How long (in ms) this mob should be alive for.
     */
    constructor(config) {
        super(config);

        /**
         * The entity that this mob is trying to do something with. i.e. character to attack, item to pick up, object to interact with.
         * @type {Entity}
         */
        this.target = null;

        // If they are holding a weapon, use the attack range of that instead.
        if (this.projectileAttackType === null) {
            this.attackRange = 1;
            this.attackFunction = this.attackMelee;
        }
        else {
            this.attackRange = this.projectileAttackType.prototype.range;
            this.attackFunction = this.attackProjectile;
        }

        // Start the loops. Loops are disabled if their rate is 0.
        if (this.moveRate > 0) {
            this.moveLoop = setTimeout(
                this.move.bind(this),
                this.moveRate + Utils.getRandomIntInclusive(0, this.moveRate),
            );
        }
        if (this.wanderRate > 0) {
            this.wanderLoop = setTimeout(
                this.wander.bind(this),
                this.wanderRate + Utils.getRandomIntInclusive(0, this.wanderRate),
            );
        }
        if (this.targetSearchRate > 0) {
            this.targetSearchLoop = setTimeout(
                this.getNearestHostileInLOS.bind(this),
                this.targetSearchRate + Utils.getRandomIntInclusive(0, this.targetSearchRate),
            );
        }
        if (this.attackRate > 0) {
            this.attackLoop = setTimeout(
                this.attack.bind(this),
                this.attackRate + Utils.getRandomIntInclusive(0, this.attackRate),
            );
        }
    }

    onDestroy() {
        clearTimeout(this.moveLoop);
        clearTimeout(this.wanderLoop);
        clearTimeout(this.targetSearchLoop);
        clearTimeout(this.attackLoop);

        super.onDestroy();
    }

    onAllHitPointsLost() {
        // Give all nearby players the glory value of this mob.
        const nearbyPlayers = this.board.getNearbyPlayers(this.row, this.col, 7);
        for (let i = 0; i < nearbyPlayers.length; i += 1) {
            nearbyPlayers[i].modGlory(+this.gloryValue);
            nearbyPlayers[i].tasks.progressTask(this.taskIdKilled);
        }

        this.dropItems();

        if (this.board && this.board.dungeon && this.dungeonKeys) {
            Object.keys(this.dungeonKeys).forEach((keyColour) => {
                this.board.dungeon.doorKeys[keyColour] += this.dungeonKeys[keyColour];
            });

            this.board.dungeon.emitDoorKeysToParty();
        }

        super.onAllHitPointsLost();
    }

    getMoveRate() {
        let { moveRate } = this;

        if (this.lastDamagedTime + 10000 > Date.now()) {
            moveRate *= 0.8;
        }

        return super.getMoveRate(moveRate);
    }

    onMove() {
        if (this.target === null) {
            if (this.wanderOffset !== null) {
                if (this.wanderDistance > 0) {
                    this.wanderDistance -= 1;
                    // Move in the current direction.
                    const offset = RowColOffsetsByDirection[this.direction];
                    // Check if there is a damaging tile in front.
                    if (this.checkForMoveHazards(offset.row, offset.col) === false) return false;
                    super.move(offset.row, offset.col);
                }
                else {
                    this.wanderOffset = null;
                }
            }
        }
        else {
            // If the target is out of view range, forget about them.
            if (this.isEntityWithinViewRange(this.target) === false) {
                this.target = null;
                return;
            }
            // If they are on the same tile, try to move apart.
            if (this.row === this.target.row && this.col === this.target.col) {
                this.moveAwayFromCurrentTile();
                return;
            }

            // If the target is out of the attack line, move closer.
            if (this.isEntityWithinAttackLine(this.target) === false) {
                this.moveTowardsEntity(this.target);
            }
        }
    }

    /**
     * Create some pickups for whatever this mob has dropped from its drop list.
     */
    dropItems() {
        this.dropList.forEach((dropConfig) => {
            // Roll for this drop as many times as it is configured to.
            for (let roll = 0; roll < dropConfig.rolls; roll += 1) {
                // Do the roll.
                if (dropConfig.dropRate >= Utils.getRandomIntInclusive(1, 100)) {
                    // Create a new pickup which will be added to the board.
                    new dropConfig.PickupType({
                        row: this.row,
                        col: this.col,
                        board: this.board,
                        itemConfig: new ItemConfig({
                            ItemType: dropConfig.PickupType.prototype.ItemType,
                            quantity: dropConfig.quantity,
                            durability: dropConfig.durability,
                        }),
                    }).emitToNearbyPlayers();
                }
            }
        });
    }

    /**
     * Empty method so interactables can call modEnergy without issue, as it assumes it is a Player, but might be a Mob.
     */
    modEnergy() { }

    move(byRows, byCols) {
        if (!this.board) return;

        // Prevent multiple move loops from being created if this move function is called again.
        clearTimeout(this.moveLoop);
        this.moveLoop = setTimeout(this.move.bind(this), this.getMoveRate());

        // If being told to move directly by some external input, do it.
        if (byRows !== undefined && byCols !== undefined) {
            super.move(byRows, byCols);
        }
        // Not being told to move, so decide for itself.
        else {
            this.onMove();
        }
    }

    moveTowardsEntity(entity) {
        const { row, col } = this;
        const targetCol = entity.col;
        const targetRow = entity.row;
        const horiDist = Math.abs(col - targetCol);
        const vertDist = Math.abs(row - targetRow);
        const { grid } = this.board;

        // TODO: also stop them from targetting if the line of sight is broken to the target (stops them bumming walls all day)

        // If the target is in the next space, don't move on top of them.
        if (horiDist + vertDist === 1) {
            return;
        }

        // If target is further away horizontally than vertically, attempt to get row aligned first, then move horizontally towards.
        if (horiDist > vertDist) {
            // Is target above mob.
            if (targetRow < row) {
                // Can this mob move up at all.
                if (grid[row - 1][col].isLowBlocked() === false) {
                    super.move(-1, 0);
                }
                // Up is blocked. Try going left or right from this spot.
                else {
                    // Is target to left of mob.
                    if (targetCol < col) {
                        // Can this mob move left at all.
                        if (grid[row][col - 1].isLowBlocked() === false) {
                            super.move(0, -1);
                        }
                        // Can't move left, try going right.
                        else {
                            super.move(0, +1);
                        }
                    }
                    // Must be to the right.
                    else {
                        // Can this mob move right at all.
                        if (grid[row][col + 1].isLowBlocked() === false) {
                            super.move(0, +1);
                        }
                        // Can't move right, try going left.
                        else {
                            super.move(0, -1);
                        }
                    }
                }
            }
            // Is target below mob.
            else if (targetRow > row) {
                // Can this mob move down at all.
                if (grid[row + 1][col].isLowBlocked() === false) {
                    super.move(+1, 0);
                }
                // Down is blocked. Try going left or right from this spot.
                else {
                    // Is target to left of mob.
                    if (targetCol < col) {
                        // Can this mob move left at all.
                        if (grid[row][col - 1].isLowBlocked() === false) {
                            super.move(0, -1);
                        }
                        // Can't move left, try going right.
                        else {
                            super.move(0, +1);
                        }
                    }
                    // Must be to the right.
                    else {
                        // Can this mob move right at all.
                        if (grid[row][col + 1].isLowBlocked() === false) {
                            super.move(0, +1);
                        }
                        // Can't move left, try going left.
                        else {
                            super.move(0, -1);
                        }
                    }
                }
            }
            // They are row aligned. Move left or right.
            else {
                // Is target to left of mob.
                if (targetCol < col) {
                    // Can this mob move left at all.
                    if (grid[row][col - 1].isLowBlocked() === false) {
                        super.move(0, -1);
                    }
                    // Can't move left, try going up or down.
                    else {
                        // TODO: If want the mobs to be able to navigate around edges that they are next to so they can reach a target, fill this part with up and down checks and moves.
                    }
                }
                // Must be to the right.
                else {
                    // Can this mob move right at all.
                    if (grid[row][col + 1].isLowBlocked() === false) {
                        super.move(0, +1);
                    }
                    // Can't move right, try going up or down.
                    else {
                        // TODO: If want the mobs to be able to navigate around edges that they are next to so they can reach a target, fill this part with up and down checks and moves.
                    }
                }
            }
        }
        // Target must be further away vertically than horizontally, attempt to get col aligned first, then move vertically towards.
        else {
            // Is target to left of mob.
            if (targetCol < col) {
                // Can this mob move to the left at all.
                if (grid[row][col - 1].isLowBlocked() === false) {
                    super.move(0, -1);
                }
                // Left is blocked. Try going up or down from this spot.
                else {
                    // Is target above mob.
                    if (targetRow < row) {
                        // Can this mob move up at all.
                        if (grid[row - 1][col].isLowBlocked() === false) {
                            super.move(-1, 0);
                        }
                        // Can't move up, try going down.
                        else {
                            super.move(+1, 0);
                        }
                    }
                    // Must be below.
                    else {
                        // Can this mob move down at all.
                        if (grid[row + 1][col].isLowBlocked() === false) {
                            super.move(+1, 0);
                        }
                        // Can't move down, try going up.
                        else {
                            super.move(-1, 0);
                        }
                    }
                }
            }
            // Is target to right of mob.
            else if (targetCol > col) {
                // Can this mob move to the right at all.
                if (grid[row][col + 1].isLowBlocked() === false) {
                    super.move(0, +1);
                }
                // Right is blocked. Try going up or down from this spot.
                else {
                    // Is target above mob.
                    if (targetRow < row) {
                        // Can this mob move up at all.
                        if (grid[row - 1][col].isLowBlocked() === false) {
                            super.move(-1, 0);
                        }
                        // Can't move up, try going down.
                        else {
                            super.move(+1, 0);
                        }
                    }
                    // Must be below.
                    else {
                        // Can this mob move down at all.
                        if (grid[row + 1][col].isLowBlocked() === false) {
                            super.move(+1, 0);
                        }
                        // Can't move down, try going up.
                        else {
                            super.move(-1, 0);
                        }
                    }
                }
            }
            // They are col aligned. Move up or down.
            else {
                // Is target above mob.
                if (targetRow < row) {
                    // Can this mob move up at all.
                    if (grid[row - 1][col].isLowBlocked() === false) {
                        super.move(-1, 0);
                    }
                    // Can't move up, try going left or right.
                    else {
                        // TODO: If want the mobs to be able to navigate around edges that they are next to so they can reach a target, fill this part with left and right checks and moves.
                    }
                }
                // Must be below.
                else {
                    // Can this mob move down at all.
                    if (grid[row + 1][col].isLowBlocked() === false) {
                        super.move(+1, 0);
                    }
                    // Can't move down, try going left or right.
                    else {
                        // TODO: If want the mobs to be able to navigate around edges that they are next to so they can reach a target, fill this part with left and right checks and moves.
                    }
                }
            }
        }

        // TODO: perhaps do something here with a `lastPosition` and/or `lastKnownTargetPosition` check to stop it moving back and forward when stuck against a wall or corner, especially when target hasn't moved.
    }

    /**
     * Move this entity away from the tile it is on. Tries to go up, down, left, then right.
     */
    moveAwayFromCurrentTile() {
        const { row, col } = this;
        const { grid } = this.board;

        // Get a randomised set of directions to try to move in.
        const randomDirectionOffsets = Utils.getRandomElement(
            DirectionsPermutationsAsRowColOffsets,
        );

        randomDirectionOffsets.some((offsets) => {
            // Check if any of the directions are not blocked.
            if (grid[row + offsets.row][col + offsets.col].isLowBlocked() === false) {
                super.move(0 + offsets.row, 0 + offsets.col);
                return true;
            }
            return false;
        });
    }

    moveAwayFromTarget() {
        const { row, col } = this;
        const targetCol = this.target.col;
        const targetRow = this.target.row;
        const horiDist = Math.abs(this.col - targetCol);
        const vertDist = Math.abs(this.row - targetRow);
        const { grid } = this.board;

        // If target is further away horizontally than vertically, attempt to move away them horizontally.
        if (horiDist > vertDist) {
            // Is target to right of mob.
            if (targetCol > col) {
                // Can this mob move to the left at all.
                if (grid[row][col - 1].isLowBlocked() === false) {
                    super.move(0, -1);
                }
                // Left is blocked. Try going up or down from this spot and then try going left again.
                else {
                    // Is target below mob.
                    if (targetRow > row) {
                        // Can this mob move up at all.
                        if (grid[row - 1][col].isLowBlocked() === false) {
                            super.move(-1, 0);
                        }
                        // Can't move up, try going down.
                        else {
                            super.move(+1, 0);
                        }
                    }
                    // Probably is above (or aligned with).
                    else {
                        // Can this mob move down at all.
                        if (grid[row + 1][col].isLowBlocked() === false) {
                            super.move(+1, 0);
                        }
                        // Can't move down, try going up.
                        else {
                            super.move(-1, 0);
                        }
                    }
                }
            }
            // Is target to left of mob.
            else if (targetCol < col) {
                // Can this mob move to the right at all.
                if (grid[row][col + 1].isLowBlocked() === false) {
                    super.move(0, +1);
                }
                // Right is blocked. Try going up or down from this spot and then try going right again.
                else {
                    // Is target below mob.
                    if (targetRow > row) {
                        // Can this mob move up at all.
                        if (grid[row - 1][col].isLowBlocked() === false) {
                            super.move(-1, 0);
                        }
                        // Can't move up, try going down.
                        else {
                            super.move(+1, 0);
                        }
                    }
                    // Probably is above (or aligned with).
                    else {
                        // Can this mob move down at all.
                        if (grid[row + 1][col].isLowBlocked() === false) {
                            super.move(+1, 0);
                        }
                        // Can't move down, try going up.
                        else {
                            super.move(-1, 0);
                        }
                    }
                }
            }
        }
        // Target must be further away vertically than horizontally (or the same), attempt to run away horizontally.
        else {
            // Is target below mob.
            if (targetRow > row) {
                // Can this mob move up at all.
                if (grid[row - 1][col].isLowBlocked() === false) {
                    super.move(-1, 0);
                }
                // Up is blocked. Try going left or right from this spot and then try going up again.
                else {
                    // Is target to right of mob.
                    if (targetCol > col) {
                        // Can this mob move left at all.
                        if (grid[row][col - 1].isLowBlocked() === false) {
                            super.move(0, -1);
                        }
                        // Can't move left, try going right.
                        else {
                            super.move(0, +1);
                        }
                    }
                    // Probably is left (or aligned with).
                    else {
                        // Can this mob move left at all.
                        if (grid[row][col - 1].isLowBlocked() === false) {
                            super.move(0, -1);
                        }
                        // Can't move left, try going right.
                        else {
                            super.move(0, +1);
                        }
                    }
                }
            }
            // Is target above mob.
            else {
                // Can this mob move down at all.
                if (grid[row + 1][col].isLowBlocked() === false) {
                    super.move(+1, 0);
                }
                // Down is blocked. Try going left or right from this spot and then try going down again.
                else {
                    // Is target to right of mob.
                    if (targetCol > col) {
                        // Can this mob move left at all.
                        if (grid[row][col - 1].isLowBlocked() === false) {
                            super.move(0, -1);
                        }
                        // Can't move left, try going right.
                        else {
                            super.move(0, +1);
                        }
                    }
                    // Probably is left (or aligned with).
                    else {
                        // Can this mob move left at all.
                        if (grid[row][col - 1].isLowBlocked() === false) {
                            super.move(0, -1);
                        }
                        // Can't move left, try going right.
                        else {
                            super.move(0, +1);
                        }
                    }
                }
            }
        }

        // If the target is too far away after this mob has moved, stop targeting them.
        if (horiDist > this.viewRange || vertDist > this.viewRange) {
            this.target = null;
        }
    }

    checkForMoveHazards(byRows, byCols) {
        // Check the grid row element being accessed is valid.
        if (this.board.grid[this.row + byRows] === undefined) return false;

        /** @type {BoardTile} */
        const boardTile = this.board.grid[this.row + byRows][this.col + byCols];

        // Check the grid col element (the tile itself) being accessed is valid.
        if (boardTile === undefined) return false;

        if (boardTile.groundType.hazardous === true) return false;

        return true;
    }

    /**
     * Find somewhere else for this mob to move to.
     * Changes to a random direction, and sets a random distance to travel.
     */
    wander() {
        this.wanderLoop = setTimeout(
            this.wander.bind(this),
            this.wanderRate + Utils.getRandomIntInclusive(0, this.wanderRate),
        );

        // Don't wander if a target is set.
        if (this.target !== null) return;

        this.modDirection(this.getRandomDirection());
        this.wanderDistance = Utils.getRandomIntInclusive(1, this.viewRange);
        this.wanderOffset = RowColOffsetsByDirection[this.direction]; // TODO: what is this? not being used, just setting direction itself?
    }

    /**
     * @param {Damage} damage
     * @param {Entity} damagedBy
     */
    onDamage(damage, damagedBy) {
        if (damagedBy instanceof Player) {
            this.target = damagedBy;
        }
        else if (damagedBy instanceof Mob) {
            // Check the faction relationship for if to target the attacker or not.
            // If damaged by a friendly mob, ignore the damage.
            if (this.Factions.getRelationship(
                this.faction,
                damagedBy.faction,
            ) === this.Factions.RelationshipStatuses.Friendly) {
                return;
            }
            // Damaged by a hostile or neutral mob, target it.

            this.target = damagedBy;
        }

        this.lastDamagedTime = Date.now();

        super.onDamage(damage, damagedBy);
    }

    /**
     * Override with what to do before attempting to attack.
     */
    preAttack() { }

    /**
     * Attempt to attack the target of this mob.
     * The attack it does depends on if this mob is melee, or uses a projectile.
     * If the target is found to be dead, stops targeting.
     */
    attack() {
        this.attackLoop = setTimeout(this.attack.bind(this), this.attackRate);
        // Don't attack if no target is set.
        if (this.target === null) return;

        // Don't let them attack if a curse forbids it.
        if (this.curse !== null) {
            if (this.curse.onCharacterAttack() === false) {
                return;
            }
        }

        this.preAttack();

        // Stop attacking if the target is dead.
        if (this.target.hitPoints <= 0) {
            this.target = null;
            return;
        }

        this.attackFunction();
    }

    /**
     * Override with what to do after a successful attack.
     */
    onAttackSuccess() { }

    /**
     * Hit the target if they are in an adjacent tile.
     */
    attackMelee() {
        // Only melee attack target if it is adjacent.
        if (this.isAdjacentToEntity(this.target) === false) return;

        // Face the target if not already doing so.
        this.modDirection(
            rowColOffsetToDirection(
                this.target.row - this.row,
                this.target.col - this.col,
            ),
        );

        this.target.damage(new Damage({
            amount: this.meleeDamageAmount,
            types: [Damage.Types.Physical],
        }), this);

        this.onAttackSuccess();
    }

    /**
     * Attempt to launch a projectile at the target of this mob.
     */
    attackProjectile() {
        // Only attack target if it is within the range of the projectile to be used.
        if (this.isEntityWithinAttackLine(this.target) === false) return;

        // If they are standing on top of each other, don't attack.
        if (this.target.row - this.row + this.target.col - this.col === 0) return;

        // Face the target if not already doing so.
        this.modDirection(
            rowColOffsetToDirection(
                this.target.row - this.row,
                this.target.col - this.col,
            ),
        );

        const offset = RowColOffsetsByDirection[this.direction];
        const { grid } = this.board;
        const thisRow = this.row;
        const thisCol = this.col;
        const targetRow = this.target.row;
        const targetCol = this.target.col;
        const attackRange = this.attackRange + 1; // +1 as the tile this entity is currently on counts as one space.
        let boardTile;

        // Check there is nothing blocking the line of sight, such as a wall.
        for (let i = 0; i < attackRange; i += 1) {
            boardTile = grid[thisRow + (offset.row * i)][thisCol + (offset.col * i)];
            if (boardTile.isHighBlocked() === true) return;
            if (targetRow === thisRow + (offset.row * i)) {
                if (targetCol === thisCol + (offset.col * i)) {
                    new this.projectileAttackType({
                        row: thisRow + offset.row, col: thisCol + offset.col, board: this.board, direction: this.direction, source: this,
                    }).emitToNearbyPlayers({});
                    this.onAttackSuccess();
                    return;
                }
            }
        }
    }

    /**
     * Changes the projectile type this mob attacks with.
     * @param {Function} ProjectileType - The projectile entity class itself, not an instance.
     */
    changeAttackProjectile(ProjectileType) {
        if (ProjectileType === this.projectileAttackType) return;
        if (ProjectileType) {
            this.projectileAttackType = ProjectileType;
            // Get the attack range from the projectile.
            this.attackRange = this.projectileAttackType.prototype.range;
            // Set the attack function in case they were on the melee one before.
            this.attackFunction = this.attackProjectile;
        }
    }

    /**
     * Looks for an entity (that this entity considers hostile) to target, in the direction this entity is facing.
     */
    getNearestHostileInLOS() {
        this.targetSearchLoop = setTimeout(this.getNearestHostileInLOS.bind(this), this.targetSearchRate);
        if (this.target !== null) return;

        if (this.direction === Directions.UP) this.target = this.getNearestHostileInLOSUp();
        else if (this.direction === Directions.DOWN) this.target = this.getNearestHostileInLOSDown();
        else if (this.direction === Directions.LEFT) this.target = this.getNearestHostileInLOSLeft();
        else this.target = this.getNearestHostileInLOSRight();
    }

    getNearestHostileInLOSUp() {
        const { row, col, viewRange } = this;
        const { grid } = this.board;
        let forwardVisibleRange = viewRange;
        let sideVisibleRange;
        let rowOffset;
        let colOffset;
        /** @type {BoardTile} */
        let boardTile;
        /** @type {Object} */
        let destroyables;
        /** @type {String} */
        let entityKey;
        /** @type {Destroyable|Mob} */
        let destroyable;
        /** @type {Number} */
        let distBetween;
        let nearestDist = viewRange + 1;
        /** @type {Entity} */
        let nearestEntity = null;

        // Check down the middle.
        outerLoop:
        for (rowOffset = 0; rowOffset < viewRange; rowOffset += 1) {
            // Check the row is valid.
            if (grid[row - rowOffset] === undefined) break;
            // Minus rowOffset to go up.
            boardTile = grid[row - rowOffset][col];
            // Check the row+col is valid.
            if (boardTile === undefined) {
                // Update the visible range.
                forwardVisibleRange = rowOffset;
                // Can't see any further. End the loop.
                break;
            }
            // Check if there is anything blocking the LOS.
            if (boardTile.isHighBlocked() === true) {
                // Update the visible range.
                forwardVisibleRange = rowOffset;
                // Can't see any further. End the loop.
                break;
            }

            destroyables = boardTile.destroyables;

            for (entityKey in destroyables) {
                if (destroyables.hasOwnProperty(entityKey) === false) continue;
                destroyable = destroyables[entityKey];

                if (this.isHostileTowardsCharacter(destroyable) === true) {
                    distBetween = Math.abs(col - destroyable.col) + Math.abs(row - destroyable.row);
                    // If it is closer than any other hostile found so far, make it the new closest.
                    if (distBetween < nearestDist) {
                        nearestDist = distBetween;
                        nearestEntity = destroyable;
                        // Stop checking other dynamics in this area, as a nearest has already been found
                        // here, and any other hostiles found would be the same distance or further away.
                        break outerLoop;
                    }
                }
            }
        }
        // Set the side visible range for the first side.
        sideVisibleRange = forwardVisibleRange;
        // Go along left, scanning up the rows each time.
        outerLoop:
        for (colOffset = 1; colOffset < viewRange; colOffset += 1) {
            // Check directly left of this mob before going down.
            // Minus colOffset to go left.
            boardTile = grid[row][col - colOffset];
            if (boardTile === undefined) break;
            // Check if there is anything blocking the LOS.
            if (boardTile.isHighBlocked() === true) break; // The left is blocked, so stop searching left.

            destroyables = boardTile.destroyables;

            for (entityKey in destroyables) {
                if (destroyables.hasOwnProperty(entityKey) === false) continue;
                destroyable = destroyables[entityKey];

                if (this.isHostileTowardsCharacter(destroyable) === true) {
                    distBetween = Math.abs(col - destroyable.col) + Math.abs(row - destroyable.row);
                    // If it is closer than any other hostile found so far, make it the new closest.
                    if (distBetween < nearestDist) {
                        nearestDist = distBetween;
                        nearestEntity = destroyable;
                        // Stop checking other dynamics in this area, as a nearest has already been found
                        // here, and any other hostiles found would be the same distance or further away.
                        break outerLoop;
                    }
                }
            }

            // Directly left is clear, now search down from there, as far as the side visible range.
            for (rowOffset = 1; rowOffset < sideVisibleRange; rowOffset += 1) {
                // Check the row is valid.
                if (grid[row - rowOffset] === undefined) break;
                // Minus rowOffset to go up.
                // Minus colOffset to go left.
                boardTile = grid[row - rowOffset][col - colOffset];
                // Check the row+col is valid.
                if (boardTile === undefined) {
                    // Update the side visible range.
                    sideVisibleRange = rowOffset;
                    // Can't see any further. End the loop.
                    break;
                }
                // Check if there is anything blocking the LOS.
                if (boardTile.isHighBlocked() === true) {
                    // Update the side visible range.
                    sideVisibleRange = rowOffset;
                    // Can't see any further. End the loop.
                    break;
                }

                destroyables = boardTile.destroyables;

                for (entityKey in destroyables) {
                    if (destroyables.hasOwnProperty(entityKey) === false) continue;
                    destroyable = destroyables[entityKey];

                    if (this.isHostileTowardsCharacter(destroyable) === true) {
                        distBetween = Math.abs(col - destroyable.col) + Math.abs(row - destroyable.row);
                        // If it is closer than any other hostile found so far, make it the new closest.
                        if (distBetween < nearestDist) {
                            nearestDist = distBetween;
                            nearestEntity = destroyable;
                            // Stop checking other dynamics in this area, as a nearest has already been found
                            // here, and any other hostiles found would be the same distance or further away.
                            break outerLoop;
                        }
                    }
                }
            }
        }
        // Reset the side visible range for the other side.
        sideVisibleRange = forwardVisibleRange;
        // Go along right, scanning up the rows each time.
        outerLoop:
        for (colOffset = 1; colOffset < viewRange; colOffset += 1) {
            // Check directly right of this mob before going down.
            // Plus colOffset to go right.
            boardTile = grid[row][col + colOffset];
            if (boardTile === undefined) break;
            // Check if there is anything blocking the LOS.
            if (boardTile.isHighBlocked() === true) break; // The right is blocked, so stop searching right.

            destroyables = boardTile.destroyables;

            for (entityKey in destroyables) {
                if (destroyables.hasOwnProperty(entityKey) === false) continue;
                destroyable = destroyables[entityKey];

                if (this.isHostileTowardsCharacter(destroyable) === true) {
                    distBetween = Math.abs(col - destroyable.col) + Math.abs(row - destroyable.row);
                    // If it is closer than any other hostile found so far, make it the new closest.
                    if (distBetween < nearestDist) {
                        nearestDist = distBetween;
                        nearestEntity = destroyable;
                        // Stop checking other dynamics in this area, as a nearest has already been found
                        // here, and any other hostiles found would be the same distance or further away.
                        break outerLoop;
                    }
                }
            }

            // Directly right is clear, now search up from there, as far as the side visible range.
            for (rowOffset = 1; rowOffset < sideVisibleRange; rowOffset += 1) {
                // Check the row is valid.
                if (grid[row - rowOffset] === undefined) break;
                // Minus rowOffset to go up.
                // Plus colOffset to go right.
                boardTile = grid[row - rowOffset][col + colOffset];
                // Check the row+col is valid.
                if (boardTile === undefined) {
                    // Update the side visible range.
                    sideVisibleRange = rowOffset;
                    // Can't see any further. End the loop.
                    break;
                }
                // Check if there is anything blocking the LOS.
                if (boardTile.isHighBlocked() === true) {
                    // Update the side visible range.
                    sideVisibleRange = rowOffset;
                    // Can't see any further. End the loop.
                    break;
                }

                destroyables = boardTile.destroyables;

                for (entityKey in destroyables) {
                    if (destroyables.hasOwnProperty(entityKey) === false) continue;
                    destroyable = destroyables[entityKey];

                    if (this.isHostileTowardsCharacter(destroyable) === true) {
                        distBetween = Math.abs(col - destroyable.col) + Math.abs(row - destroyable.row);
                        // If it is closer than any other hostile found so far, make it the new closest.
                        if (distBetween < nearestDist) {
                            nearestDist = distBetween;
                            nearestEntity = destroyable;
                            // Stop checking other dynamics in this area, as a nearest has already been found
                            // here, and any other hostiles found would be the same distance or further away.
                            break outerLoop;
                        }
                    }
                }
            }
        }

        return nearestEntity;
    }

    getNearestHostileInLOSDown() {
        const { row, col, viewRange } = this;
        const { grid } = this.board;
        let forwardVisibleRange = viewRange;
        let sideVisibleRange;
        let rowOffset;
        let colOffset;
        /** @type {BoardTile} */
        let boardTile;
        /** @type {Object} */
        let destroyables;
        /** @type {String} */
        let entityKey;
        /** @type {Destroyable|Mob} */
        let destroyable;
        /** @type {Number} */
        let distBetween;
        let nearestDist = viewRange + 1;
        /** @type {Entity} */
        let nearestEntity = null;

        // Check down the middle.
        outerLoop:
        for (rowOffset = 0; rowOffset < viewRange; rowOffset += 1) {
            // Check the row is valid.
            if (grid[row + rowOffset] === undefined) break;
            // Plus rowOffset to go down.
            boardTile = grid[row + rowOffset][col];
            // Check the row+col is valid.
            if (boardTile === undefined) {
                // Update the visible range.
                forwardVisibleRange = rowOffset;
                // Can't see any further. End the loop.
                break;
            }
            // Check if there is anything blocking the LOS.
            if (boardTile.isHighBlocked() === true) {
                // Update the visible range.
                forwardVisibleRange = rowOffset;
                // Can't see any further. End the loop.
                break;
            }

            destroyables = boardTile.destroyables;

            for (entityKey in destroyables) {
                if (destroyables.hasOwnProperty(entityKey) === false) continue;
                destroyable = destroyables[entityKey];

                if (this.isHostileTowardsCharacter(destroyable) === true) {
                    distBetween = Math.abs(col - destroyable.col) + Math.abs(row - destroyable.row);
                    // If it is closer than any other hostile found so far, make it the new closest.
                    if (distBetween < nearestDist) {
                        nearestDist = distBetween;
                        nearestEntity = destroyable;
                        // Stop checking other dynamics in this area, as a nearest has already been found
                        // here, and any other hostiles found would be the same distance or further away.
                        break outerLoop;
                    }
                }
            }
        }
        // Set the side visible range for the first side.
        sideVisibleRange = forwardVisibleRange;
        // Go along left, scanning down the rows each time.
        outerLoop:
        for (colOffset = 1; colOffset < viewRange; colOffset += 1) {
            // Check directly left of this mob before going down.
            // Minus colOffset to go left.
            boardTile = grid[row][col - colOffset];
            if (boardTile === undefined) break;
            // Check if there is anything blocking the LOS.
            if (boardTile.isHighBlocked() === true) break; // The left is blocked, so stop searching left.

            destroyables = boardTile.destroyables;

            for (entityKey in destroyables) {
                if (destroyables.hasOwnProperty(entityKey) === false) continue;
                destroyable = destroyables[entityKey];

                if (this.isHostileTowardsCharacter(destroyable) === true) {
                    distBetween = Math.abs(col - destroyable.col) + Math.abs(row - destroyable.row);
                    // If it is closer than any other hostile found so far, make it the new closest.
                    if (distBetween < nearestDist) {
                        nearestDist = distBetween;
                        nearestEntity = destroyable;
                        // Stop checking other dynamics in this area, as a nearest has already been found
                        // here, and any other hostiles found would be the same distance or further away.
                        break outerLoop;
                    }
                }
            }

            // Directly left is clear, now search down from there, as far as the side visible range.
            for (rowOffset = 1; rowOffset < sideVisibleRange; rowOffset += 1) {
                // Check the row is valid.
                if (grid[row + rowOffset] === undefined) break;
                // Plus rowOffset to go down.
                // Minus colOffset to go left.
                boardTile = grid[row + rowOffset][col - colOffset];
                // Check the row+col is valid.
                if (boardTile === undefined) {
                    // Update the side visible range.
                    sideVisibleRange = rowOffset;
                    // Can't see any further. End the loop.
                    break;
                }
                // Check if there is anything blocking the LOS.
                if (boardTile.isHighBlocked() === true) {
                    // Update the side visible range.
                    sideVisibleRange = rowOffset;
                    // Can't see any further. End the loop.
                    break;
                }

                destroyables = boardTile.destroyables;

                for (entityKey in destroyables) {
                    if (destroyables.hasOwnProperty(entityKey) === false) continue;
                    destroyable = destroyables[entityKey];

                    if (this.isHostileTowardsCharacter(destroyable) === true) {
                        distBetween = Math.abs(col - destroyable.col) + Math.abs(row - destroyable.row);
                        // If it is closer than any other hostile found so far, make it the new closest.
                        if (distBetween < nearestDist) {
                            nearestDist = distBetween;
                            nearestEntity = destroyable;
                            // Stop checking other dynamics in this area, as a nearest has already been found
                            // here, and any other hostiles found would be the same distance or further away.
                            break outerLoop;
                        }
                    }
                }
            }
        }
        // Reset the side visible range for the other side.
        sideVisibleRange = forwardVisibleRange;
        // Go along right, scanning down the rows each time.
        outerLoop:
        for (colOffset = 1; colOffset < viewRange; colOffset += 1) {
            // Check directly right of this mob before going down.
            // Plus colOffset to go right.
            boardTile = grid[row][col + colOffset];
            if (boardTile === undefined) break;
            // Check if there is anything blocking the LOS.
            if (boardTile.isHighBlocked() === true) break; // The right is blocked, so stop searching right.

            destroyables = boardTile.destroyables;

            for (entityKey in destroyables) {
                if (destroyables.hasOwnProperty(entityKey) === false) continue;
                destroyable = destroyables[entityKey];

                if (this.isHostileTowardsCharacter(destroyable) === true) {
                    distBetween = Math.abs(col - destroyable.col) + Math.abs(row - destroyable.row);
                    // If it is closer than any other hostile found so far, make it the new closest.
                    if (distBetween < nearestDist) {
                        nearestDist = distBetween;
                        nearestEntity = destroyable;
                        // Stop checking other dynamics in this area, as a nearest has already been found
                        // here, and any other hostiles found would be the same distance or further away.
                        break outerLoop;
                    }
                }
            }

            // Directly right is clear, now search up from there, as far as the side visible range.
            for (rowOffset = 1; rowOffset < sideVisibleRange; rowOffset += 1) {
                // Check the row is valid.
                if (grid[row + rowOffset] === undefined) break;
                // Plus rowOffset to go down.
                // Plus colOffset to go right.
                boardTile = grid[row + rowOffset][col + colOffset];
                // Check the row+col is valid.
                if (boardTile === undefined) {
                    // Update the side visible range.
                    sideVisibleRange = rowOffset;
                    // Can't see any further. End the loop.
                    break;
                }
                // Check if there is anything blocking the LOS.
                if (boardTile.isHighBlocked() === true) {
                    // Update the side visible range.
                    sideVisibleRange = rowOffset;
                    // Can't see any further. End the loop.
                    break;
                }

                destroyables = boardTile.destroyables;

                for (entityKey in destroyables) {
                    if (destroyables.hasOwnProperty(entityKey) === false) continue;
                    destroyable = destroyables[entityKey];

                    if (this.isHostileTowardsCharacter(destroyable) === true) {
                        distBetween = Math.abs(col - destroyable.col) + Math.abs(row - destroyable.row);
                        // If it is closer than any other hostile found so far, make it the new closest.
                        if (distBetween < nearestDist) {
                            nearestDist = distBetween;
                            nearestEntity = destroyable;
                            // Stop checking other dynamics in this area, as a nearest has already been found
                            // here, and any other hostiles found would be the same distance or further away.
                            break outerLoop;
                        }
                    }
                }
            }
        }

        return nearestEntity;
    }

    getNearestHostileInLOSLeft() {
        const { row, col, viewRange } = this;
        const { grid } = this.board;
        let forwardVisibleRange = viewRange;
        let sideVisibleRange;
        let rowOffset;
        let colOffset;
        /** @type {BoardTile} */
        let boardTile;
        /** @type {Object} */
        let destroyables;
        /** @type {String} */
        let entityKey;
        /** @type {Destroyable|Mob} */
        let destroyable;
        /** @type {Number} */
        let distBetween;
        let nearestDist = viewRange + 1;
        /** @type {Entity} */
        let nearestEntity = null;

        // Check down the middle.
        outerLoop:
        for (colOffset = 0; colOffset < viewRange; colOffset += 1) {
            // Minus colOffset to go left.
            boardTile = grid[row][col - colOffset];
            // Check the row+col is valid.
            if (boardTile === undefined) {
                // Update the visible range.
                forwardVisibleRange = colOffset;
                // Can't see any further. End the loop.
                break;
            }
            // Check if there is anything blocking the LOS.
            if (boardTile.isHighBlocked() === true) {
                // Update the visible range.
                forwardVisibleRange = colOffset;
                // Can't see any further. End the loop.
                break;
            }

            destroyables = boardTile.destroyables;

            for (entityKey in destroyables) {
                if (destroyables.hasOwnProperty(entityKey) === false) continue;
                destroyable = destroyables[entityKey];

                if (this.isHostileTowardsCharacter(destroyable) === true) {
                    distBetween = Math.abs(col - destroyable.col) + Math.abs(row - destroyable.row);
                    // If it is closer than any other hostile found so far, make it the new closest.
                    if (distBetween < nearestDist) {
                        nearestDist = distBetween;
                        nearestEntity = destroyable;
                        // Stop checking other dynamics in this area, as a nearest has already been found
                        // here, and any other hostiles found would be the same distance or further away.
                        break outerLoop;
                    }
                }
            }
        }
        // Set the side visible range for the first side.
        sideVisibleRange = forwardVisibleRange;
        // Go along upwards, scanning left the columns each time.
        outerLoop:
        for (rowOffset = 1; rowOffset < viewRange; rowOffset += 1) {
            // Check directly above this mob before going left.
            // Check the row is valid.
            if (grid[row - rowOffset] === undefined) break;
            // Minus rowOffset to go up.
            boardTile = grid[row - rowOffset][col];

            if (boardTile === undefined) break;
            // Check if there is anything blocking the LOS.
            if (boardTile.isHighBlocked() === true) break; // Up is blocked, so stop searching up.

            destroyables = boardTile.destroyables;

            for (entityKey in destroyables) {
                if (destroyables.hasOwnProperty(entityKey) === false) continue;
                destroyable = destroyables[entityKey];

                if (this.isHostileTowardsCharacter(destroyable) === true) {
                    distBetween = Math.abs(col - destroyable.col) + Math.abs(row - destroyable.row);
                    // If it is closer than any other hostile found so far, make it the new closest.
                    if (distBetween < nearestDist) {
                        nearestDist = distBetween;
                        nearestEntity = destroyable;
                        // Stop checking other dynamics in this area, as a nearest has already been found
                        // here, and any other hostiles found would be the same distance or further away.
                        break outerLoop;
                    }
                }
            }

            // Directly above is clear, now search left from there, as far as the side visible range.
            for (colOffset = 1; colOffset < sideVisibleRange; colOffset += 1) {
                // Check the row is valid.
                if (grid[row - rowOffset] === undefined) break;
                // Minus rowOffset to go up.
                // Minus colOffset to go left.
                boardTile = grid[row - rowOffset][col - colOffset];
                // Check the row+col is valid.
                if (boardTile === undefined) {
                    // Update the side visible range.
                    sideVisibleRange = rowOffset;
                    // Can't see any further. End the loop.
                    break;
                }
                // Check if there is anything blocking the LOS.
                if (boardTile.isHighBlocked() === true) {
                    // Update the side visible range.
                    sideVisibleRange = rowOffset;
                    // Can't see any further. End the loop.
                    break;
                }

                destroyables = boardTile.destroyables;

                for (entityKey in destroyables) {
                    if (destroyables.hasOwnProperty(entityKey) === false) continue;
                    destroyable = destroyables[entityKey];

                    if (this.isHostileTowardsCharacter(destroyable) === true) {
                        distBetween = Math.abs(col - destroyable.col) + Math.abs(row - destroyable.row);
                        // If it is closer than any other hostile found so far, make it the new closest.
                        if (distBetween < nearestDist) {
                            nearestDist = distBetween;
                            nearestEntity = destroyable;
                            // Stop checking other dynamics in this area, as a nearest has already been found
                            // here, and any other hostiles found would be the same distance or further away.
                            break outerLoop;
                        }
                    }
                }
            }
        }
        // Reset the side visible range for the other side.
        sideVisibleRange = forwardVisibleRange;
        // Go along downwards, scanning left the rows each time.
        outerLoop:
        for (rowOffset = 1; rowOffset < viewRange; rowOffset += 1) {
            // Check directly below this mob before going left.
            // Check the row is valid.
            if (grid[row + rowOffset] === undefined) break;

            // Plus rowOffset to go down.
            boardTile = grid[row + rowOffset][col];

            if (boardTile === undefined) break;
            // Check if there is anything blocking the LOS.
            if (boardTile.isHighBlocked() === true) break; // Down is blocked, so stop searching down.

            destroyables = boardTile.destroyables;

            for (entityKey in destroyables) {
                if (destroyables.hasOwnProperty(entityKey) === false) continue;
                destroyable = destroyables[entityKey];

                if (this.isHostileTowardsCharacter(destroyable) === true) {
                    distBetween = Math.abs(col - destroyable.col) + Math.abs(row - destroyable.row);
                    // If it is closer than any other hostile found so far, make it the new closest.
                    if (distBetween < nearestDist) {
                        nearestDist = distBetween;
                        nearestEntity = destroyable;
                        // Stop checking other dynamics in this area, as a nearest has already been found
                        // here, and any other hostiles found would be the same distance or further away.
                        break outerLoop;
                    }
                }
            }

            // Directly below is clear, now search left from there, as far as the side visible range.
            for (colOffset = 1; colOffset < sideVisibleRange; colOffset += 1) {
                // Check the row is valid.
                if (grid[row + rowOffset] === undefined) break;
                // Plus rowOffset to go down.
                // Minus colOffset to go left.
                boardTile = grid[row + rowOffset][col - colOffset];
                // Check the row+col is valid.
                if (boardTile === undefined) {
                    // Update the side visible range.
                    sideVisibleRange = rowOffset;
                    // Can't see any further. End the loop.
                    break;
                }
                // Check if there is anything blocking the LOS.
                if (boardTile.isHighBlocked() === true) {
                    // Update the side visible range.
                    sideVisibleRange = rowOffset;
                    // Can't see any further. End the loop.
                    break;
                }

                destroyables = boardTile.destroyables;

                for (entityKey in destroyables) {
                    if (destroyables.hasOwnProperty(entityKey) === false) continue;
                    destroyable = destroyables[entityKey];

                    if (this.isHostileTowardsCharacter(destroyable) === true) {
                        distBetween = Math.abs(col - destroyable.col) + Math.abs(row - destroyable.row);
                        // If it is closer than any other hostile found so far, make it the new closest.
                        if (distBetween < nearestDist) {
                            nearestDist = distBetween;
                            nearestEntity = destroyable;
                            // Stop checking other dynamics in this area, as a nearest has already been found
                            // here, and any other hostiles found would be the same distance or further away.
                            break outerLoop;
                        }
                    }
                }
            }
        }

        return nearestEntity;
    }

    getNearestHostileInLOSRight() {
        const { row, col, viewRange } = this;
        const { grid } = this.board;
        let forwardVisibleRange = viewRange;
        let sideVisibleRange;
        let rowOffset;
        let colOffset;
        /** @type {BoardTile} */
        let boardTile;
        /** @type {Object} */
        let destroyables;
        /** @type {String} */
        let entityKey;
        /** @type {Destroyable|Mob} */
        let destroyable;
        /** @type {Number} */
        let distBetween;
        let nearestDist = viewRange + 1;
        /** @type {Entity} */
        let nearestEntity = null;

        // Check down the middle.
        outerLoop:
        for (colOffset = 0; colOffset < viewRange; colOffset += 1) {
            // Plus colOffset to go right.
            boardTile = grid[row][col + colOffset];
            // Check the row+col is valid.
            if (boardTile === undefined) {
                // Update the visible range.
                forwardVisibleRange = colOffset;
                // Can't see any further. End the loop.
                break;
            }
            // Check if there is anything blocking the LOS.
            if (boardTile.isHighBlocked() === true) {
                // Update the visible range.
                forwardVisibleRange = colOffset;
                // Can't see any further. End the loop.
                break;
            }

            destroyables = boardTile.destroyables;

            for (entityKey in destroyables) {
                if (destroyables.hasOwnProperty(entityKey) === false) continue;
                destroyable = destroyables[entityKey];

                if (this.isHostileTowardsCharacter(destroyable) === true) {
                    distBetween = Math.abs(col - destroyable.col) + Math.abs(row - destroyable.row);
                    // If it is closer than any other hostile found so far, make it the new closest.
                    if (distBetween < nearestDist) {
                        nearestDist = distBetween;
                        nearestEntity = destroyable;
                        // Stop checking other dynamics in this area, as a nearest has already been found
                        // here, and any other hostiles found would be the same distance or further away.
                        break outerLoop;
                    }
                }
            }
        }
        // Set the side visible range for the first side.
        sideVisibleRange = forwardVisibleRange;
        // Go along upwards, scanning right the columns each time.
        outerLoop:
        for (rowOffset = 1; rowOffset < viewRange; rowOffset += 1) {
            // Check directly above this mob before going right.
            // Check the row is valid.
            if (grid[row - rowOffset] === undefined) break;
            // Minus rowOffset to go up.
            boardTile = grid[row - rowOffset][col];

            if (boardTile === undefined) break;
            // Check if there is anything blocking the LOS.
            if (boardTile.isHighBlocked() === true) break; // Up is blocked, so stop searching up.

            destroyables = boardTile.destroyables;

            for (entityKey in destroyables) {
                if (destroyables.hasOwnProperty(entityKey) === false) continue;
                destroyable = destroyables[entityKey];

                if (this.isHostileTowardsCharacter(destroyable) === true) {
                    distBetween = Math.abs(col - destroyable.col) + Math.abs(row - destroyable.row);
                    // If it is closer than any other hostile found so far, make it the new closest.
                    if (distBetween < nearestDist) {
                        nearestDist = distBetween;
                        nearestEntity = destroyable;
                        // Stop checking other dynamics in this area, as a nearest has already been found
                        // here, and any other hostiles found would be the same distance or further away.
                        break outerLoop;
                    }
                }
            }

            // Directly above is clear, now search right from there, as far as the side visible range.
            for (colOffset = 1; colOffset < sideVisibleRange; colOffset += 1) {
                // Check the row is valid.
                if (grid[row - rowOffset] === undefined) break;
                // Minus rowOffset to go up.
                // Plus colOffset to go right.
                boardTile = grid[row - rowOffset][col + colOffset];
                // Check the row+col is valid.
                if (boardTile === undefined) {
                    // Update the side visible range.
                    sideVisibleRange = rowOffset;
                    // Can't see any further. End the loop.
                    break;
                }
                // Check if there is anything blocking the LOS.
                if (boardTile.isHighBlocked() === true) {
                    // Update the side visible range.
                    sideVisibleRange = rowOffset;
                    // Can't see any further. End the loop.
                    break;
                }

                destroyables = boardTile.destroyables;

                for (entityKey in destroyables) {
                    if (destroyables.hasOwnProperty(entityKey) === false) continue;
                    destroyable = destroyables[entityKey];

                    if (this.isHostileTowardsCharacter(destroyable) === true) {
                        distBetween = Math.abs(col - destroyable.col) + Math.abs(row - destroyable.row);
                        // If it is closer than any other hostile found so far, make it the new closest.
                        if (distBetween < nearestDist) {
                            nearestDist = distBetween;
                            nearestEntity = destroyable;
                            // Stop checking other dynamics in this area, as a nearest has already been found
                            // here, and any other hostiles found would be the same distance or further away.
                            break outerLoop;
                        }
                    }
                }
            }
        }
        // Reset the side visible range for the other side.
        sideVisibleRange = forwardVisibleRange;
        // Go along downwards, scanning right the rows each time.
        outerLoop:
        for (rowOffset = 1; rowOffset < viewRange; rowOffset += 1) {
            // Check directly below this mob before going right.
            // Check the row is valid.
            if (grid[row + rowOffset] === undefined) break;
            // Plus rowOffset to go down.
            boardTile = grid[row + rowOffset][col];

            if (boardTile === undefined) break;
            // Check if there is anything blocking the LOS.
            if (boardTile.isHighBlocked() === true) break; // Down is blocked, so stop searching down.

            destroyables = boardTile.destroyables;

            for (entityKey in destroyables) {
                if (destroyables.hasOwnProperty(entityKey) === false) continue;
                destroyable = destroyables[entityKey];

                if (this.isHostileTowardsCharacter(destroyable) === true) {
                    distBetween = Math.abs(col - destroyable.col) + Math.abs(row - destroyable.row);
                    // If it is closer than any other hostile found so far, make it the new closest.
                    if (distBetween < nearestDist) {
                        nearestDist = distBetween;
                        nearestEntity = destroyable;
                        // Stop checking other dynamics in this area, as a nearest has already been found
                        // here, and any other hostiles found would be the same distance or further away.
                        break outerLoop;
                    }
                }
            }

            // Directly below is clear, now search right from there, as far as the side visible range.
            for (colOffset = 1; colOffset < sideVisibleRange; colOffset += 1) {
                // Check the row is valid.
                if (grid[row + rowOffset] === undefined) break;
                // Plus rowOffset to go down.
                // Plus colOffset to go right.
                boardTile = grid[row + rowOffset][col + colOffset];
                // Check the row+col is valid.
                if (boardTile === undefined) {
                    // Update the side visible range.
                    sideVisibleRange = rowOffset;
                    // Can't see any further. End the loop.
                    break;
                }
                // Check if there is anything blocking the LOS.
                if (boardTile.isHighBlocked() === true) {
                    // Update the side visible range.
                    sideVisibleRange = rowOffset;
                    // Can't see any further. End the loop.
                    break;
                }

                destroyables = boardTile.destroyables;

                for (entityKey in destroyables) {
                    if (destroyables.hasOwnProperty(entityKey) === false) continue;
                    destroyable = destroyables[entityKey];

                    if (this.isHostileTowardsCharacter(destroyable) === true) {
                        distBetween = Math.abs(col - destroyable.col) + Math.abs(row - destroyable.row);
                        // If it is closer than any other hostile found so far, make it the new closest.
                        if (distBetween < nearestDist) {
                            nearestDist = distBetween;
                            nearestEntity = destroyable;
                            // Stop checking other dynamics in this area, as a nearest has already been found
                            // here, and any other hostiles found would be the same distance or further away.
                            break outerLoop;
                        }
                    }
                }
            }
        }

        return nearestEntity;
    }

    /**
     * TODO: Could do with removing??? Might need it for non-LOS based mobs.
     * Gets the nearest entity to this mob that it considers hostile, according to its faction status.
     */
    getNearestHostile() {
        let rowOffset = -this.viewRange;
        let colOffset = -this.viewRange;
        const { viewRange } = this;
        const viewRangePlusOne = viewRange + 1;
        let gridRow;
        /** @type {Object} */
        let destroyables;
        /** @type {String} */
        let entityKey;
        /** @type {Destroyable|Mob} */
        let destroyable;
        /** @type {Number} */
        let distBetween;
        let nearestDist = viewRangePlusOne;
        /** @type {Entity} */
        let nearestEntity = null;

        // Search all tiles within the view range to find a target.
        for (; rowOffset < viewRangePlusOne; rowOffset += 1) {
            gridRow = this.board.grid[this.row + rowOffset];

            // Check the row is valid.
            if (gridRow === undefined) continue;

            for (colOffset = -viewRange; colOffset < viewRangePlusOne; colOffset += 1) {
                // Check the col is valid.
                if (gridRow[this.col + colOffset] === undefined) continue;

                destroyables = gridRow[this.col + colOffset].destroyables;

                for (entityKey in destroyables) {
                    if (destroyables.hasOwnProperty(entityKey) === false) continue;
                    destroyable = destroyables[entityKey];// TODO: if using this function again, check the isHostileToCharacter faction.

                    // Ignore anything that isn't a character.
                    if (destroyable instanceof Character === false) continue;
                    // Check this mob is hostile towards the other character.
                    if (this.Factions.getRelationship(this.faction, destroyable.faction) === this.Factions.RelationshipStatuses.Hostile) {
                        distBetween = Math.abs(this.col - destroyable.col) + Math.abs(this.row - destroyable.row);
                        // If it is closer than any other hostile found so far, make it the new closest.
                        if (distBetween < nearestDist) {
                            nearestDist = distBetween;
                            nearestEntity = destroyable;
                            // Stop checking other dynamics in this board tile, as a nearest has already
                            // been found here, and any other hostiles found would be the same distance.
                            break;
                        }
                    }
                }
            }
        }

        return nearestEntity;
    }

    /**
     * Is the entity within the view range of this entity, in any direction.
     * @param {Entity} entity
     * @returns {Boolean}
     */
    isEntityWithinViewRange(entity) {
        if (Math.abs(this.col - entity.col) >= this.viewRange) return false;
        if (Math.abs(this.row - entity.row) >= this.viewRange) return false;

        return true;
    }

    /**
     * Is the given entity within the line of attack of this entity. Doesn't check if blocked by anything.
     * @param {Entity} entity
     * @returns {Boolean}
     */
    isEntityWithinAttackLine(entity) {
        if (this.row === entity.row) {
            if (Math.abs(this.col - entity.col) <= this.attackRange) {
                return true;
            }
        }
        if (this.col === entity.col) {
            if (Math.abs(this.row - entity.row) <= this.attackRange) {
                return true;
            }
        }
        return false;
    }

    /**
     * Checks whether this mob hostile towards the given character.
     * @param {Character} character
     * @returns {Boolean}
     */
    isHostileTowardsCharacter(character) {
        // Ignore anything that isn't a character.
        if (character instanceof Character === false) return false;

        // Check this mob is hostile towards the other character.
        if (this.Factions.getRelationship(
            this.faction,
            character.faction,
        ) === this.Factions.RelationshipStatuses.Hostile) return true;

        return false;
    }

    teleportBehindTarget() {
        // Don't bother if no target.
        if (this.target === null) return;
        // Check the target is alive.
        if (this.target.hitPoints < 1) {
            this.target = null;
            return;
        }

        // Get the position behind the target.
        const behindTile = this.board.getTileBehind(
            this.target.direction,
            this.target.row,
            this.target.col,
        );
        if (!behindTile) return;

        // Check the tile behind them isn't blocked before moving.
        if (behindTile.isLowBlocked()) return;

        // Avoid teleporting onto hazards.
        if (behindTile.groundType.hazardous) return;

        const behindOffset = RowColOffsetsByDirection[OppositeDirections[this.target.direction]];
        // Move behind the target if possible.
        if (!this.repositionAndEmitToNearbyPlayers(
            this.target.row + behindOffset.row,
            this.target.col + behindOffset.col,
        )) return;
        // Face the target's back.
        this.modDirection(this.target.direction);
    }

    teleportOntoTarget() {
        // Don't bother if no target.
        if (this.target === null) return;
        // Check the target is alive.
        if (this.target.hitPoints < 1) {
            this.target = null;
            return;
        }

        // Avoid teleporting onto hazards if the target is standing on one.
        if (this.target.getBoardTile().groundType.hazardous) return;

        // Cannot reach their back. Teleport onto the same tile instead.
        this.repositionAndEmitToNearbyPlayers(this.target.row, this.target.col);
    }

    /**
     * Assigns the property values for this mob type from the mob values data list.
     */
    static assignMobValues() {
        const valuesTypeName = this.prototype.constructor.name;
        /** @type {MobStats} */
        const statValues = Mob.StatValues[valuesTypeName];
        if (statValues === undefined) Utils.warning("No mob stat values defined for type name:", valuesTypeName);
        this.prototype.gloryValue = statValues.gloryValue;
        this.prototype.maxHitPoints = statValues.maxHitPoints;
        this.prototype.defence = statValues.defence;
        this.prototype.viewRange = statValues.viewRange;
        this.prototype.moveRate = statValues.moveRate;
        if (this.prototype.moveRate === 0) {
            // If the move rate is 0, make them unable to move, or
            // they will have unlimited move speed/teleport to target.
            this.prototype.move = () => { };
        }
        this.prototype.wanderRate = statValues.wanderRate;
        this.prototype.targetSearchRate = statValues.targetSearchRate;
        this.prototype.attackRate = statValues.attackRate;
        this.prototype.meleeDamageAmount = statValues.meleeDamageAmount;
        this.prototype.projectileAttackType = statValues.projectileAttackType;
        this.prototype.CorpseType = statValues.corpseType;
        this.prototype.faction = statValues.faction;
        this.prototype.behaviour = statValues.behaviour;
        this.prototype.dropList = statValues.dropList;
    }

    static loadConfigs() {
        // eslint-disable-next-line global-require
        Mob.StatValues = require("../../../../../../gameplay/MobStats");

        Object.values(EntitiesList).forEach((EntityType) => {
            if (EntityType.assignMobValues) EntityType.assignMobValues();
        });
    }
}
module.exports = Mob;

Mob.abstract = true;

Mob.StatValues = null;

// Give each mob easy access to the behaviours list.
Mob.prototype.Behaviours = require("../../../../../../gameplay/Behaviours");

/**
 * How much glory is given out to all nearby players when this mob dies.
 * @type {Number}
 * @default 0
 */
Mob.prototype.gloryValue = 0;

/**
 * How far away the target needs to be for this mob to start targeting it, and any further away before this mob stops targeting it.
 * Also used for the max wander distance per wander.
 * @type {Number}
 * @default 0
 */
Mob.prototype.viewRange = 0;
/**
 * How often (in ms) this mob moves along its path when it has one, in ms. Lower is faster.
 * @type {Number}
 * @default 1000
 */
Mob.prototype.moveRate = 1000;

/** ****************** WANDER ******************* */
/**
 * How often (in ms) this mob looks for a new position within the wander range to wander towards. Lower is more often.
 * @type {Number}
 * @default 10000
 */
Mob.prototype.wanderRate = 10000;
/**
 * How often this mob looks for a new position within the wander range to wander towards.
 * @type {Object} An object of {row, col} with a direction vector to use when wandering, instead of calculating each time from the direction. Null if not currently wandering.
 */
Mob.prototype.wanderOffset = null;
/**
 * The maximum amount of tiles this mob can travel at most per wander.
 * @type {Number}
 */
// Mob.prototype.maxWanderRange = 10; TODO remove?
/**
 * How many tiles this mob will travel from its current position every time it decides to wander.
 * @type {Number}
 */
// Mob.prototype.wanderRange = Mob.prototype.maxWanderRange; TODO remove?

/** ****************** ATTACK ******************* */
/**
 * How often (in ms) this mob searches for a new target if it doesn't already have one. If it already has a target, it will stay focused on that instead. Lower is more often.
 * @type {Number}
 * @default 4000
 */
Mob.prototype.targetSearchRate = 4000;
/**
 * How often (in ms) this mob calls its attack function. Lower is more often.
 * @type {Number}
 * @default 1500
 */
Mob.prototype.attackRate = 1500;
/**
 * How close this mob needs to be to attack. Uses the projectile range if this mob attacks with a projectile.
 * @type {Number}
 * @default 1
 */
Mob.prototype.attackRange = 1;
/**
 * How much damage this mob deals when it melee hits something. If this mob has a projectile attack type defined, it will not use its melee attack.
 * @type {Number}
 * @default 0
 */
Mob.prototype.meleeDamageAmount = 0;

Mob.prototype.meleeDamageTypes = [Damage.Types.Physical];

Mob.prototype.meleeDamageArmourPiercing = 0;
/**
 * The kind of projectile that this mob will use to attack. The class itself, not an instance of it.
 * @type {Function|Null}
 */
Mob.prototype.projectileAttackType = null;
/**
 * The function to be called every attack rate interval. Typically shoots a projectile or melee attacks.
 * @type {Function|Null}
 */
Mob.prototype.attackFunction = Mob.prototype.attackMelee;

/**
 * The behaviour of this mob. Won't attack other faction members.
 * Behaviour is more specific way to define how each NPC type acts, as there might be multiple kinds of NPC in the same faction, but they don't all do the same thing.
 * @type {Number}
 * @default Cowardly
 */
Mob.prototype.behaviour = Mob.prototype.Behaviours.Cowardly;

/**
 * Whether this mob is locked within the bounds of the spawner that it was spawned from, or if it free to move as far as it wants.
 * @type {Number}
 * @default false
 */
Mob.prototype.constrainedToSpawnerBounds = false;

/**
 * An array of pickups that could be created when this mob is destroyed.
 * @type {Array.<Drop>}
 */
Mob.prototype.dropList = [];
