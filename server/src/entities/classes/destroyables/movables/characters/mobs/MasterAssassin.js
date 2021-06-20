const Boss = require("./Boss");
const ProjShuriken = require("../../projectiles/ProjShuriken");
const { Directions } = require("../../../../../../gameplay/Directions");

const specAttack1Rate = 6000;
const specAttack2Rate = 8000;

class MasterAssassin extends Boss {
    /**
     * @param {Object} config
     * @param {Number} config.row
     * @param {Number} config.col
     * @param {Board} config.board
     */
    constructor(config) {
        super(config);

        this.specialAttack1Timeout = setInterval(this.specialAttack1.bind(this), specAttack1Rate);
        this.specialAttack2Timeout = setInterval(this.specialAttack2.bind(this), specAttack2Rate);
    }

    onDestroy() {
        clearTimeout(this.specialAttack1Timeout);
        clearTimeout(this.specialAttack2Timeout);

        super.onDestroy();
    }

    specialAttack1() {
        // Try to teleport behind the target.
        if (!this.teleportBehindTarget()) {
            // Failed to teleport behind, try teleporting directing onto them.
            this.teleportOntoTarget();
        }
    }

    specialAttack2() {
        // Don't bother if no target.
        if (this.target !== null) {
            // Check the target is alive.
            if (this.target.hitPoints < 1) {
                this.target = null;
                return;
            }

            const { row, col, board } = this;
            // Throw a shuriken in each direction.
            new ProjShuriken({
                row: row - 1, col, board, direction: Directions.UP, source: this,
            }).emitToNearbyPlayers();
            new ProjShuriken({
                row: row + 1, col, board, direction: Directions.DOWN, source: this,
            }).emitToNearbyPlayers();
            new ProjShuriken({
                row, col: col - 1, board, direction: Directions.LEFT, source: this,
            }).emitToNearbyPlayers();
            new ProjShuriken({
                row, col: col + 1, board, direction: Directions.RIGHT, source: this,
            }).emitToNearbyPlayers();
        }
    }
}
module.exports = MasterAssassin;

MasterAssassin.prototype.taskIdKilled = require("../../../../../../tasks/TaskTypes").KillOutlaws.taskId;
