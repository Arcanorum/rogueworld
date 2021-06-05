const Boss = require("./Boss");
const { HealthRegen } = require("../../../../../../gameplay/StatusEffects");
const EntitiesList = require("../../../../../EntitiesList");

const specialAttack1Rate = 15000;
const specialAttack2Rate = 5000;

class Elder extends Boss {
    /**
     * @param {Object} config
     * @param {Number} config.row
     * @param {Number} config.col
     * @param {Board} config.board
     */
    constructor(config) {
        super(config);

        this.specialAttack1Timeout = setInterval(this.specialAttack1.bind(this), specialAttack1Rate);
        this.specialAttack2Timeout = setInterval(this.specialAttack2.bind(this), specialAttack2Rate);
    }

    onDestroy() {
        clearTimeout(this.specialAttack1Timeout);
        clearTimeout(this.specialAttack2Timeout);

        super.onDestroy();
    }

    /**
     * Heal self over time (i.e. healing potion).
     */
    specialAttack1() {
        // Heal if damaged.
        if (this.hitPoints < this.maxHitPoints) {
            this.addStatusEffect(HealthRegen);
        }
    }

    /**
     * Wave of wind.
     */
    specialAttack2() {
        // Don't bother if no target.
        if (this.target !== null) {
            // Check the target is alive.
            if (this.target.hitPoints < 1) {
                this.target = null;
                return;
            }

            const targetDirection = this.board.rowColOffsetToDirection(
                this.target.row - this.row, this.target.col - this.col,
            );

            // Get the tile next to the mob, in the direction to attack in.
            const targetPosition = this.board.getRowColInFront(
                targetDirection,
                this.row,
                this.col,
            );

            // Get the positions to the sides of that position.
            const sidePositions = this.board.getRowColsToSides(
                targetDirection,
                targetPosition.row,
                targetPosition.col,
            );

            // Add the middle one.
            sidePositions.push(targetPosition);

            // Make some wind projectiles in the same direction, at those positions.
            sidePositions.forEach((position) => {
                new EntitiesList.ProjWind({
                    row: position.row,
                    col: position.col,
                    board: this.board,
                    direction: targetDirection,
                    source: this,
                }).emitToNearbyPlayers();
            });
        }
    }
}
module.exports = Elder;
