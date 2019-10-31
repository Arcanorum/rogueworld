
const Mob = require('./Mob');

class Boss extends Mob {

    /**
     * @param {Object} config
     * @param {Number} config.row
     * @param {Number} config.col
     * @param {Board} config.board
     */
    constructor (config) {
        super(config);

        DungeonsList.ByName[this.board.name].unlock(this);
    }

    onDestroy () {
        DungeonsList.ByName[this.board.name].lock();

        super.onDestroy();
    }

}
module.exports = Boss;

Boss.prototype.dropAmount = 3;

const DungeonsList = require('../../../../../DungeonsList');