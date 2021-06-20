const Boss = require("./Boss");
const ProjAcorn = require("../../projectiles/ProjAcorn");
const GrassScamp = require("./GrassScamp");
const { Directions } = require("../../../../../../gameplay/Directions");

const specialAttack1Rate = 30000;
const specialAttack2Rate = 6000;

class GreatGnarl extends Boss {
    /**
     * @param {Object} config
     * @param {Number} config.row
     * @param {Number} config.col
     * @param {Board} config.board
     */
    constructor(config) {
        super(config);

        this.specialAttack1Timeout = setTimeout(this.specialAttack1.bind(this), specialAttack1Rate);
        this.specialAttack2Timeout = setTimeout(this.specialAttack2.bind(this), specialAttack2Rate);
    }

    /**
     * Prevent gnarls from ever being moved.
     */
    move() {}

    onDestroy() {
        clearTimeout(this.specialAttack1Timeout);
        clearTimeout(this.specialAttack2Timeout);

        super.onDestroy();
    }

    /**
     * Spawns some grass scamps.
     */
    specialAttack1() {
        // Don't bother if no target.
        if (this.target !== null) {
            // Check the target is alive.
            if (this.target.hitPoints < 1) {
                this.target = null;
                return;
            }
            // Spawn a grass scamp in each direction.
            // TODO: Check the tile in each direction is valid.
            const grassScamp1 = new GrassScamp({
                row: this.row - 1, col: this.col - 1, board: this.board, lifespan: 60000,
            }).emitToNearbyPlayers();
            const grassScamp2 = new GrassScamp({
                row: this.row - 1, col: this.col + 1, board: this.board, lifespan: 60000,
            }).emitToNearbyPlayers();
            const grassScamp3 = new GrassScamp({
                row: this.row + 1, col: this.col - 1, board: this.board, lifespan: 60000,
            }).emitToNearbyPlayers();
            const grassScamp4 = new GrassScamp({
                row: this.row + 1, col: this.col + 1, board: this.board, lifespan: 60000,
            }).emitToNearbyPlayers();

            grassScamp1.modDirection("u");
            grassScamp2.modDirection("r");
            grassScamp3.modDirection("l");
            grassScamp4.modDirection("d");

            grassScamp1.dropList = [];
            grassScamp2.dropList = [];
            grassScamp3.dropList = [];
            grassScamp4.dropList = [];
        }
        this.specialAttack1Timeout = setTimeout(this.specialAttack1.bind(this), specialAttack1Rate);
    }

    /**
     * Throws acorns in each direction.
     */
    specialAttack2() {
        // Don't bother if no target.
        if (this.target !== null) {
            // Check the target is alive.
            if (this.target.hitPoints < 1) {
                this.target = null;
                return;
            }

            const { row, col, board } = this;
            // Throw an acorn in each direction.
            new ProjAcorn({
                row: row - 1, col, board, direction: Directions.UP, source: this,
            }).emitToNearbyPlayers();
            new ProjAcorn({
                row: row + 1, col, board, direction: Directions.DOWN, source: this,
            }).emitToNearbyPlayers();
            new ProjAcorn({
                row, col: col - 1, board, direction: Directions.LEFT, source: this,
            }).emitToNearbyPlayers();
            new ProjAcorn({
                row, col: col + 1, board, direction: Directions.RIGHT, source: this,
            }).emitToNearbyPlayers();
        }
        this.specialAttack2Timeout = setTimeout(this.specialAttack2.bind(this), specialAttack2Rate);
    }
}
module.exports = GreatGnarl;

GreatGnarl.prototype.taskIdKilled = require("../../../../../../tasks/TaskTypes").KillGnarls.taskId;
