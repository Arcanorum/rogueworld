
const Static = require('./Static');

class Entrance extends Static {

    /**
     * @param {Object} config
     * @param {Number} config.row - For Entrances, this is the top row.
     * @param {Number} config.col - For Entrances, this is the left col.
     * @param {Board} config.board
     * @param {Number} config.width - How many tiles wide.
     * @param {Number} config.height - How many tiles high.
     * @param {String} config.entranceName - The unique name ID for this entrance. Used to access this object in Board.entrances.
     */
    constructor (config) {
        super(config);

        this.top = config.row;
        this.bottom = config.row + config.height - 1;
        this.left = config.col;
        this.right = config.col + config.width - 1;

        // Make this entrance occupy all of the static spaces of the area it covers, so clans can't build over them.
        let colOffset,
            rowOffset,
            grid = this.board.grid;
        for(colOffset=0; colOffset<config.width; colOffset+=1){
            for(rowOffset=0; rowOffset<config.height; rowOffset+=1){
                grid[this.row + rowOffset][this.col + colOffset].static = this;
            }
        }

        config.board.entrances[config.entranceName] = this;
    }

    /**
     * Gets a random position within the bounds of this entrance.
     * @returns {{row: Number, col: Number}}
     */
    getRandomPosition () {
        return {
            row: Math.round(Math.random() * (this.top - this.bottom) + this.bottom),
            col: Math.round(Math.random() * (this.left - this.right) + this.right)
        };
    }

}

module.exports = Entrance;

Entrance.prototype._lowBlocked = false;
Entrance.prototype._highBlocked = false;