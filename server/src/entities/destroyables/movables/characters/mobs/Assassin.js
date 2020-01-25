
const Mob = require('./Mob');
const Utils = require('./../../../../../Utils');

class Assassin extends Mob {
    /**
     * @category Mob
     * 
     * @param {Object} config
     * @param {Number} config.row
     * @param {Number} config.col
     * @param {Board} config.board
     */
    constructor (config) {
        super(config);

        // This mob type can have different projectile attacks.
        if(Utils.getRandomIntInclusive(0, 1) === 1){
            this.changeAttackProjectile(ProjShuriken);
        }

        this.specialAttackTimeout = setTimeout(this.specialAttack.bind(this), 10000);
    }

    onDestroy () {
        clearTimeout(this.specialAttackTimeout);

        super.onDestroy();
    }

    specialAttack () {
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
        this.specialAttackTimeout = setTimeout(this.specialAttack.bind(this), 10000);
    }

}
module.exports = Assassin;

const ProjShuriken = require('./../../projectiles/ProjShuriken');

Assassin.prototype.registerEntityType();
Assassin.prototype.assignMobValues();
Assassin.prototype.taskIDKilled = require('../../../../../tasks/TaskTypes').KillOutlaws.taskID;