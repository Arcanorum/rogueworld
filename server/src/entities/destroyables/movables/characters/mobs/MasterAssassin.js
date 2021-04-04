const Boss = require("./Boss");
const Utils = require("../../../../../Utils");

const specialAttack1Rate = 6000;
const specialAttack2Rate = 8000;

class MasterAssassin extends Boss {
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

    specialAttack1() {
        this.teleportBehindTarget() || this.teleportOntoTarget();
    }

    specialAttack2() {
        // Don't bother if no target.
        if (this.target !== null) {
            // Check the target is alive.
            if (this.target.hitPoints < 1) {
                this.target = null;
                return;
            }
            // Throw a shuriken in each direction.
            new ProjShuriken({
                row: this.row - 1, col: this.col, board: this.board, direction: this.Directions.UP, source: this,
            }).emitToNearbyPlayers();
            new ProjShuriken({
                row: this.row + 1, col: this.col, board: this.board, direction: this.Directions.DOWN, source: this,
            }).emitToNearbyPlayers();
            new ProjShuriken({
                row: this.row, col: this.col - 1, board: this.board, direction: this.Directions.LEFT, source: this,
            }).emitToNearbyPlayers();
            new ProjShuriken({
                row: this.row, col: this.col + 1, board: this.board, direction: this.Directions.RIGHT, source: this,
            }).emitToNearbyPlayers();
        }
    }
}
module.exports = MasterAssassin;

const ProjShuriken = require("../../projectiles/ProjShuriken");

MasterAssassin.prototype.taskIdKilled = require("../../../../../tasks/TaskTypes").KillOutlaws.taskId;
