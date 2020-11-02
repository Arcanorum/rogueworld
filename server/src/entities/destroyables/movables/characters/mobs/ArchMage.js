const Boss = require('./Boss');
const Utils = require('../../../../../Utils');

const specialAttack1Rate = 5000;
const specialAttack2Rate = 10000;
const specialAttack3Rate = 3000;

class ArchMage extends Boss {
    /**
     * @category Mob
     * 
     * @param {Object} config
     * @param {Number} config.row
     * @param {Number} config.col
     * @param {Board} config.board
     */
    constructor(config) {
        super(config);

        this.specialAttack1Timeout = setInterval(this.specialAttack1.bind(this), specialAttack1Rate);
        this.specialAttack2Timeout = setInterval(this.specialAttack2.bind(this), specialAttack2Rate);
        this.specialAttack3Timeout = setInterval(this.specialAttack3.bind(this), specialAttack3Rate);
    }

    onDestroy() {
        clearTimeout(this.specialAttack1Timeout);
        clearTimeout(this.specialAttack2Timeout);
        clearTimeout(this.specialAttack3Timeout);

        super.onDestroy();
    }

    /**
     * Shoot Pacify.
     */
    specialAttack1() {
        // Don't bother if no target.
        if (this.target !== null) {
            // Check the target is alive.
            if (this.target.hitPoints < 1) {
                this.target = null;
                return;
            }

            const targetDirection = this.board.rowColOffsetToDirection(this.target.row - this.row, this.target.col - this.col);

            // Shoot a pacify projectile at the target.
            new ProjPacify({ row: this.row, col: this.col, board: this.board, direction: targetDirection, source: this }).emitToNearbyPlayers();
        }
    }

    /**
     * Ward and heal self.
     */
    specialAttack2() {
        // Heal if damaged.
        if (this.hitPoints < this.maxHitPoints) this.heal(
            new Heal(20)
        );

        // Cast ward on self.
        new MagicEffects.Ward(this);
    }

    /**
     * Check for projectiles to reflect.
     */
    specialAttack3() {
        const checkRange = 5;
        const checkRangePlusOne = checkRange + 1;
        let row;
        /** @type {BoardTile} */
        let tile;

        // Up and down.
        for (let i = -checkRange; i < checkRangePlusOne; i += 1) {
            row = this.board.grid[this.row + i];
            if (row === undefined) continue;
            tile = row[this.col];
            if (tile === undefined) continue;

            let destroyables = tile.destroyables;

            for (let key in destroyables) {
                if (destroyables[key] instanceof Projectile) {
                    // Ignore own projectiles.
                    if (destroyables[key].source === this) continue;
                    // Up.
                    if (i < 0) {
                        new ProjWind({ row: this.row, col: this.col, board: this.board, direction: this.Directions.UP, source: this }).emitToNearbyPlayers();
                    }
                    // Down.
                    else if (i > 0) {
                        new ProjWind({ row: this.row, col: this.col, board: this.board, direction: this.Directions.DOWN, source: this }).emitToNearbyPlayers();
                    }
                }
            }
        }

        // Left and right.
        row = this.board.grid[this.row];
        for (let i = -checkRange; i < checkRangePlusOne; i += 1) {
            tile = row[this.col + i];
            if (tile === undefined) continue;

            let destroyables = tile.destroyables;

            for (let key in destroyables) {
                if (destroyables[key] instanceof Projectile) {
                    // Left.
                    if (i < 0) {
                        new ProjWind({ row: this.row, col: this.col, board: this.board, direction: this.Directions.LEFT, source: this }).emitToNearbyPlayers();
                    }
                    // Right.
                    else if (i > 0) {
                        new ProjWind({ row: this.row, col: this.col, board: this.board, direction: this.Directions.RIGHT, source: this }).emitToNearbyPlayers();
                    }
                }
            }
        }

    }

}
module.exports = ArchMage;

const Projectile = require('./../../projectiles/Projectile');
const ProjWind = require('./../../projectiles/ProjWind');
const ProjPacify = require('./../../projectiles/ProjPacify');
const MagicEffects = require('./../../../../../gameplay/MagicEffects');
const Heal = require('../../../../../gameplay/Heal');

ArchMage.prototype.registerEntityType();
ArchMage.prototype.assignMobValues();