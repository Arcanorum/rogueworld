
const Boss = require('./Boss');
const Utils = require('./../../../../../Utils');

class MasterAssassin extends Boss {

    /**
     * @param {Object} config
     * @param {Number} config.row
     * @param {Number} config.col
     * @param {Board} config.board
     */
    constructor (config) {
        super(config);

        this.specialAttack1Timeout = setTimeout(this.specialAttack1.bind(this), 6000);
        this.specialAttack2Timeout = setTimeout(this.specialAttack2.bind(this), 8000);
    }

    onDestroy () {
        clearTimeout(this.specialAttack1Timeout);
        clearTimeout(this.specialAttack2Timeout);

        super.onDestroy();
    }

    specialAttack1 () {
        // Don't bother if no target.
        if(this.target !== null){
            // Check the target is alive.
            if(this.target.hitPoints < 1){
                this.target = null;
                return;
            }
            // Get the position behind the target.
            const behindOffset = this.board.directionToRowColOffset(this.OppositeDirections[this.target.direction]);
            const behindRow = this.board.grid[this.target.row + behindOffset.row];
            if(behindRow === undefined) return;
            /** @type {BoardTile} */
            const behindTile = behindRow[this.target.col + behindOffset.col];
            if(behindTile === undefined) return;
            // Check the tile behind them isn't blocked before moving.
            if(behindTile.isLowBlocked() === false){
                // Move behind the target.
                this.repositionAndEmitToNearbyPlayers(this.target.row + behindOffset.row, this.target.col + behindOffset.col);
                // Face the target's back.
                this.modDirection(this.target.direction);
            }
        }
        this.specialAttack1Timeout = setTimeout(this.specialAttack1.bind(this), 6000);
    }

    specialAttack2 () {
        // Don't bother if no target.
        if(this.target !== null){
            // Check the target is alive.
            if(this.target.hitPoints < 1){
                this.target = null;
                return;
            }
            // Throw a shuriken in each direction.
            new ProjShuriken({row: this.row - 1 , col: this.col, board: this.board, direction: this.Directions.UP, source: this}).emitToNearbyPlayers();
            new ProjShuriken({row: this.row + 1, col: this.col, board: this.board, direction: this.Directions.DOWN, source: this}).emitToNearbyPlayers();
            new ProjShuriken({row: this.row, col: this.col - 1, board: this.board, direction: this.Directions.LEFT, source: this}).emitToNearbyPlayers();
            new ProjShuriken({row: this.row, col: this.col + 1, board: this.board, direction: this.Directions.RIGHT, source: this}).emitToNearbyPlayers();
        }
        this.specialAttack2Timeout = setTimeout(this.specialAttack2.bind(this), 8000);
    }

}
module.exports = MasterAssassin;

const ProjShuriken = require('./../../projectiles/ProjShuriken');

MasterAssassin.prototype.registerEntityType();
MasterAssassin.prototype.assignMobValues("Master assassin", MasterAssassin.prototype);
MasterAssassin.prototype.CorpseType = require('../../../corpses/CorpseHuman');
MasterAssassin.prototype.taskIDKilled = require('../../../../../tasks/TaskTypes').KillOutlaws.taskID;
MasterAssassin.prototype.dropList = [
    require('../../../pickups/PickupRespawnOrb'),
    require('../../../pickups/PickupExpOrbMelee'),
    require('../../../pickups/PickupExpOrbRanged'),
    require('../../../pickups/PickupSuperFireStaff'),
    require('../../../pickups/PickupBloodGem'),
    require('../../../pickups/PickupFireGem'),
    require('../../../pickups/PickupWindGem'),
    require('../../../pickups/PickupNinjaGarb'),
    require('../../../pickups/PickupNoctisDagger'),
];